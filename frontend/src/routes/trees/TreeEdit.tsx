import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState, useAppDispatch } from "../../redux/store";
import { fetchEditerTreeData } from "../../redux/slices/treesSlice/cases/fetchEditTreeData";
import { useEffect, useRef, useState } from "react";
import userImg from "../../assets/user_image.png";
import * as d3 from "d3";
import { useContainerDimensions } from "../../globalHooks/useContainerDimensions.ts";
import {
    EditedTree,
    FamilyMember,
    MouseMode,
    setMouseMode,
    Node,
    setSelectedNode,
    resetSelection,
} from "../../redux/slices/treesSlice/editedTreeSlice.ts";
import Popup from "reactjs-popup";
import { FamilyMemberInfo } from "../../globalComponents/modals/FamilyMemberInfo.tsx";
import { createFamilyMember } from "../../redux/slices/treesSlice/cases/craeteFamilyMember.ts";
import { createNewNode } from "../../redux/slices/treesSlice/cases/createNewNode.ts";
import { removeNode } from "../../redux/slices/treesSlice/cases/RemoveNode.ts";
import { removeConnection } from "../../redux/slices/treesSlice/cases/tests/removeConnection.ts";
import { toast } from "react-toastify";
import { createConnection } from "../../redux/slices/treesSlice/cases/tests/createConnection.ts";

export const TreeEdit = () => {
    const params = useParams();
    const dispatch = useAppDispatch();
    const editedTree = useSelector((root: RootState) => root.editedTree);
    const user = useSelector((root: RootState) => root.user);
    const [selectedFamMamber, setSelectedFamMember] = useState<string | null>(null);
    const latestEditedTree = useRef<EditedTree>(editedTree);
    const mapRef = useRef(null);
    const { width: famTreeWidth, height: famTreeHeight } = useContainerDimensions(mapRef);

    useEffect(() => {
        dispatch(fetchEditerTreeData({ treeId: params.id || "-1", token: user.jwt }));
    }, []);
    useEffect(() => {
        latestEditedTree.current = editedTree;
        const imageSize = 50;
        const nodeSize = 15;
        const labelSize = 15;

        const focus = d3.select(".plot-area");
        let nodesData = latestEditedTree.current.nodes.map((d) => ({
            x: d.posX,
            y: d.posY,
            ...d,
        }));

        // so family members will be rendered first and be on top of nodes
        nodesData.sort((a, _) => (a.famMemId !== null ? 1 : 0));

        const linksData = latestEditedTree.current.connections.map((d) => ({
            index: d.id,
            target: d.to,
            source: d.from,
            ...d,
        }));
        if (!nodesData || !linksData) return;

        // creating entire chart
        let simulation = d3
            .forceSimulation(nodesData)
            .force("charge", d3.forceManyBody().strength(50))
            .force("x", d3.forceX())
            .force("y", d3.forceY());

        const svg = d3.select(mapRef.current);

        // creating connection between nodes
        const links = focus.selectAll(".link").data(linksData, (d: any) => d.id);

        // Handle the exit selection
        links.exit().remove();

        // Handle the enter selection
        const linkEnter = links
            .lower()
            .enter()
            .append("g")
            .append("path")
            .attr("class", "link")
            .style("stroke-width", 1)
            .style("stroke", "#fff")
            .style("fill", "#fff");

        // Merge the enter and existing selections
        let link = linkEnter.merge(links as any);

        link.attr("d", (d) => {
            const source = nodesData.find((node) => node.id === d.from);
            const target = nodesData.find((node) => node.id === d.to);

            if (source && target) {
                return `M${source.posX + (source.famMemId ? imageSize / 2 : nodeSize / 2)},${
                    source.posY + (source.famMemId ? imageSize / 2 : nodeSize / 2)
                } L${target.posX + (target.famMemId ? imageSize / 2 : nodeSize / 2)},${
                    target.posY + (target.famMemId ? imageSize / 2 : nodeSize / 2)
                }`;
            } else {
                // Handle cases where source or target is not found
                return "";
            }
        });

        // defining clipPaths as masks which make images be in circle
        const masks = focus.selectAll("clipPath").data(
            nodesData.filter((d) => d.famMemId),
            (d: any) => d.id
        );
        // seting attributes of masks
        masks
            .enter()
            .append("clipPath")
            .attr("id", (d) => `clipPath${d.id}`)
            .append("rect")
            .attr("width", () => {
                return imageSize;
            })
            .attr("height", () => {
                return imageSize;
            })
            .attr("rx", () => {
                return imageSize;
            })
            .attr("ry", () => {
                return imageSize;
            });

        // defining nodes as elements g with .nodes class
        const node = focus.selectAll(".nodes").data(
            nodesData.filter((d) => d.id),
            (d: any) => d.id
        );

        const nodeEnter = node
            .raise()
            .enter()
            .append("g")
            .attr("id", (d) => `node${d.id}`)
            .on("mouseenter", nodeMouseover)
            .on("mouseleave", nodeMouseLeave)
            .on("click", nodeMouseClick)
            .attr("class", "nodes")
            .style("cursor", "pointer");

        // inserting rect into nodes so it will have background.
        // if not family member it is a white circle
        nodeEnter
            .append("rect")
            .attr("width", (d) => (d.famMemId ? imageSize : nodeSize))
            .attr("height", (d) => (d.famMemId ? imageSize : nodeSize))
            .attr("x", (d) => d.x)
            .attr("y", (d) => d.y)
            .attr("rx", (d) => (d.famMemId ? 0 : imageSize + 50))
            .attr("ry", (d) => (d.famMemId ? 0 : imageSize + 50))
            .style("stroke-width", (d) => (d.famMemId ? 1 : 0.6))
            .style(`fill`, (d) => (d.famMemId ? `#292929` : "#fff"))
            .attr("opacity", (d) => (d.famMemId != null ? "0" : "1"));

        // inserting images into family member nodes
        nodeEnter
            .append("image")
            // @ts-ignore
            .attr("xlink:href", (d) => {
                if (d.famMemId) {
                    const [familyMember] = latestEditedTree.current.members.filter(
                        (member) => member.id === d.famMemId
                    );
                    return familyMember
                        ? familyMember.imgUrl
                            ? familyMember.imgUrl
                            : userImg
                        : "#";
                }
                return "#";
            })
            .attr("width", (d) => (d.famMemId ? imageSize : nodeSize))
            .attr("height", (d) => (d.famMemId ? imageSize : nodeSize))
            .attr("transform", function (d) {
                return `translate(${d.x}, ${d.y})`;
            })
            .attr("clip-path", (d) => `url(#clipPath${d.id})`)
            .on("error", function () {
                d3.select(this).attr("xlink:href", (d: any) => (d.famMemId ? userImg : "#"));
            });

        nodeEnter
            .append("text")
            .attr("class", "label")
            .attr("id", (d) => `label${d.id}`)
            .text(function (d) {
                const member = latestEditedTree.current.members.find(
                    (mem) => mem.id === d.famMemId
                );
                const titleToDisplay = d.famMemId ? `${member?.name} ${member?.surname}` || "" : "";

                return titleToDisplay;
            })
            .attr("font-size", `${labelSize}px`)
            .attr("fill-opacity", "0")
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("transform", function (d) {
                const member = latestEditedTree.current.members.find(
                    (mem) => mem.id === d.famMemId
                );
                const titleToDisplay = d.famMemId ? `${member?.name} ${member?.surname}` || "" : "";

                // ayo that's sick. ugly and slow in performance but works
                const tempText = document.createElementNS("http://www.w3.org/2000/svg", "text");
                tempText.textContent = titleToDisplay;
                tempText.setAttribute("font-size", `${labelSize}px`);
                document.body.appendChild(tempText);

                // Get the width of the temporary text element
                const textWidth = tempText.getBBox().width;

                // Remove the temporary text element
                document.body.removeChild(tempText);

                // Calculate the offset for centering horizontally
                const offset = Math.round(imageSize / 2) - textWidth / 2;

                return "translate(" + (d.x + offset) + "," + (d.y + imageSize + labelSize) + ")";
            })
            .style("fill", function (d) {
                return d.selected ? "#fff" : "#FD7900";
            });

        function nodeMouseover(this: any, _: any, d: Node) {
            if (d.famMemId) {
                const theNode = d3.select(this);

                const member = latestEditedTree.current.members.find(
                    (mem) => mem.id === d.famMemId
                );
                const titleToDisplay = d.famMemId ? `${member?.name} ${member?.surname}` || "" : "";

                // Append temporary text element to the SVG container
                const tempText = theNode
                    .append("text")
                    .attr("class", "temp-label")
                    .text(titleToDisplay)
                    .attr("font-size", `${labelSize}px`)
                    .attr("opacity", "0")
                    .node() as SVGTextElement;

                // Get the width of the temporary text element
                const textWidth = tempText.getBBox().width;
                const textHeight = tempText.getBBox().height;

                const offset = Math.round(imageSize / 2) - textWidth / 2;

                // Remove the temporary text element
                d3.select(tempText).remove();

                theNode.transition().duration(250).select(".label").attr("fill-opacity", "1");
                theNode
                    .transition()
                    .duration(250)
                    .select("rect")
                    .attr("height", `${imageSize + textHeight + labelSize}`)
                    .attr("width", `${imageSize - offset * 2}`)
                    .attr("transform", "translate(" + -Math.abs(offset) + "," + 0 + ")")
                    .attr("opacity", "1");
            }
        }
        function nodeMouseLeave(this: any, _: any, d: Node) {
            if (d.famMemId) {
                const theNode = d3.select(this);

                theNode.transition().duration(250).select(".label").attr("fill-opacity", "0");
                theNode
                    .transition()
                    .duration(250)
                    .select("rect")
                    .attr("width", `${imageSize}`)
                    .attr("height", `${imageSize}`)
                    .attr("transform", "translate(" + 0 + "," + 0 + ")")
                    .attr("opacity", "0");
            }
        }

        function nodeMouseClick(this: any, _: any, d: Node & { selected: boolean }) {
            if (latestEditedTree.current.MouseMode == MouseMode.Delete) {
                dispatch(
                    removeNode({
                        node: {
                            id: d.id,
                            familyMember: d.famMemId,
                            familyTree: d.familyTree,
                            posX: d.posX,
                            posY: d.posY,
                        },
                        token: user.jwt,
                    })
                );
            } else if (latestEditedTree.current.MouseMode == MouseMode.RmLink) {
                const selected = latestEditedTree.current.nodes.find((o) => o.selected);
                if (!selected) {
                    console.log("setting new node: ", d.id);
                    dispatch(setSelectedNode(d));
                } else {
                    if (d.id == selected.id) {
                        dispatch(resetSelection());
                        return toast.error("can't remove connection from yourself");
                    }
                    const connection = latestEditedTree.current.connections.find(
                        (o) =>
                            (o.from === selected.id && o.to === d.id) ||
                            (o.from === d.id && o.to === selected.id)
                    );
                    if (!connection) {
                        dispatch(resetSelection());
                        return toast.error("can't remove not existing connection");
                    } else {
                        console.log("found connection to be removed: ", connection);
                    }
                    console.log("removing connection from", selected.id, d.id);
                    dispatch(setMouseMode(MouseMode.None));
                    dispatch(removeConnection([selected, d]));
                    dispatch(resetSelection());
                }
            } else if (latestEditedTree.current.MouseMode == MouseMode.Link) {
                const selected = latestEditedTree.current.nodes.find((o) => o.selected);
                if (!selected) {
                    console.log("setting new node: ", d.id);
                    dispatch(setSelectedNode(d));
                } else {
                    if (d.id == selected.id) {
                        dispatch(resetSelection());
                        return toast.error("can't create connection with yourself");
                    }
                    const connection = latestEditedTree.current.connections.find(
                        (o) =>
                            (o.from === selected.id && o.to === d.id) ||
                            (o.from === d.id && o.to === selected.id)
                    );
                    if (connection) {
                        dispatch(resetSelection());
                        return toast.error("connection already exists");
                    } else {
                        console.log("found connection to be removed: ", connection);
                    }
                    console.log("removing connection from", selected.id, d.id);
                    dispatch(setMouseMode(MouseMode.None));
                    dispatch(createConnection([selected, d]));
                    dispatch(resetSelection());
                }
            } else {
                setSelectedFamMember(d.famMemId);
            }
        }

        let shadow = svg.select("#shadow-circle");
        if (shadow.empty()) {
            shadow = svg
                .append("circle")
                .attr("id", "shadow-circle")
                .attr("r", imageSize / 2) // Adjust the radius as needed
                .style("fill", "gray") as any; // Adjust the color as needed
        }

        svg.on("mousemove", function (event) {
            const [mouseX, mouseY] = d3.pointer(event);
            if (
                latestEditedTree.current.MouseMode == MouseMode.Create ||
                latestEditedTree.current.MouseMode == MouseMode.CreateNode
            ) {
                shadow.attr("cx", mouseX).attr("cy", mouseY);
                shadow.style("opacity", 0.5);
            } else {
                shadow.style("opacity", 0.0);
            }
        });

        svg.on("click", function (event: any) {
            if (
                latestEditedTree.current.MouseMode == MouseMode.Create ||
                latestEditedTree.current.MouseMode == MouseMode.CreateNode
            ) {
                shadow.style("opacity", 0.0);
                dispatch(setMouseMode(MouseMode.None));
                const newId = editedTree.familyTree!.id || ""; // 100% sure it is here
                const [mouseX, mouseY] = d3.pointer(event, focus.node());
                if (latestEditedTree.current.MouseMode == MouseMode.Create) {
                    dispatch(
                        createFamilyMember({
                            member: {
                                id: newId,
                                name: "New",
                                surname: "Member",
                                birthDate: null,
                                deathDate: null,
                                status: "dead",
                                additionalData: "",
                                imgUrl: "",
                            },
                            token: user.jwt,
                        })
                    ).then((d) => {
                        dispatch(
                            createNewNode({
                                node: {
                                    id: newId.toString(),
                                    posX: mouseX - imageSize / 2,
                                    posY: mouseY - imageSize / 2,
                                    familyMember: (d.payload as FamilyMember).id,
                                    familyTree: editedTree.familyTree?.id || "",
                                },
                                token: user.jwt,
                            })
                        )
                            .then(() => shadow.attr("cx", -500).attr("cy", -500))
                            .catch(() => shadow.attr("cx", -500).attr("cy", -500));
                    });
                    dispatch(resetSelection());
                }
                if (latestEditedTree.current.MouseMode == MouseMode.CreateNode) {
                    dispatch(
                        createNewNode({
                            node: {
                                id: newId.toString(),
                                posX: mouseX - nodeSize / 2,
                                posY: mouseY - nodeSize / 2,
                                familyTree: editedTree.familyTree?.id || "",
                                familyMember: null,
                            },
                            token: user.jwt,
                        })
                    )
                        .then(() => shadow.attr("cx", -500).attr("cy", -500))
                        .catch(() => shadow.attr("cx", -500).attr("cy", -500));
                    dispatch(resetSelection());
                }
            }
        });

        //defining zooming functionality
        function zoomed({ transform }: any) {
            focus.attr("transform", transform);
        }

        const zoom = d3
            .zoom<SVGSVGElement, unknown>()
            .extent([
                [0, 0],
                [famTreeWidth, famTreeHeight],
            ])
            .scaleExtent([0, 8])
            .on("zoom", zoomed);

        // without any it has error with types
        // it just works if it is left like this
        // bettor to not touch
        svg.call(zoom as any);

        // needs to be here
        node.exit().remove();

        const updateNodes = () => {
            // Update SVG elements based on simulation state
            const members = latestEditedTree.current.members;

            svg.selectAll(".link")
                // .lower()
                .attr("d", (d: any) => {
                    const source = nodesData.find((node) => node.id === d.from);
                    const target = nodesData.find((node) => node.id === d.to);

                    if (source && target) {
                        return `M${
                            source.posX + (source.famMemId ? imageSize / 2 : nodeSize / 2)
                        },${source.posY + (source.famMemId ? imageSize / 2 : nodeSize / 2)} L${
                            target.posX + (target.famMemId ? imageSize / 2 : nodeSize / 2)
                        },${target.posY + (target.famMemId ? imageSize / 2 : nodeSize / 2)}`;
                    } else {
                        // Handle cases where source or target is not found
                        return "";
                    }
                });

            svg.selectAll(".nodes")
                .attr("x", (d: any) => d.x)
                .attr("y", (d: any) => d.y)
                // .raise()
                .select("text")
                .text((d: any) => {
                    const member = members.find((mem) => mem.id == d.famMemId);
                    if (member) return `${member.name} ${member.surname}`;
                    if (d.famMemId) return "name not found";
                    return null;
                });
            svg.selectAll(".nodes")
                .select("image")
                // @ts-ignore
                .attr("xlink:href", (d: any) => {
                    if (d.famMemId) {
                        const [familyMember] = latestEditedTree.current.members.filter(
                            (member) => member.id === d.famMemId
                        );
                        return familyMember
                            ? familyMember.imgUrl
                                ? familyMember.imgUrl
                                : userImg
                            : "#";
                    }
                    return "#";
                });
        };
        simulation.on("tick", updateNodes);

        // defining button to reset position
        const resetPos = () => {
            svg.transition()
                .duration(750)
                .call(zoom.transform as any, d3.zoomIdentity);
            svg.call(zoom as any);
        };
        d3.select("#resetButton").on("click", resetPos);

        return () => {
            // Cleanup or stop simulation if needed
            simulation.stop();
        };
    }, [editedTree]);
    return (
        <>
            <main className="w-full flex h-[100vh] bg-mainBg text-default-color">
                <div className="relative basis-full h-[100vh] overflow-hidden">
                    <svg
                        ref={mapRef}
                        className={`absolute left-0 top-0 max-w-[${famTreeWidth}px] max-h-[${famTreeHeight}px]`}
                        viewBox={`0 0 ${famTreeWidth} ${famTreeHeight}`}
                    >
                        <g className="plot-area" />
                    </svg>
                    <button id="resetButton" className="button fixed left-0 bottom-0">
                        reset position
                    </button>
                </div>
            </main>
            <Popup
                open={selectedFamMamber !== null}
                // trigger={
                //     <button
                //         onClick={() => setPopupOpen(true)}
                //         className="button orange absolute right-10 bottom-1/2 translate-y-1/2"
                //     >
                //         CREATE NEW TREE
                //     </button>
                // }
                onClose={() => {
                    setSelectedFamMember(null);
                }}
                modal
                nested
            >
                {
                    // It looks like there is a line to allow it but it is commented out
                    // I'm assuming it was difficult to type properly and the library author gave up.
                    // @ts-ignore
                    (close) => (
                        <>
                            {selectedFamMamber && (
                                <FamilyMemberInfo
                                    famMember={
                                        editedTree.members.find(
                                            (m) => m.id === selectedFamMamber
                                        ) as FamilyMember
                                    }
                                    close={close}
                                />
                            )}
                        </>
                    )
                }
            </Popup>
        </>
    );
};
