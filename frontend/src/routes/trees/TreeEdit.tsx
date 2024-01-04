import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { AppDispatch, RootState } from "../../redux/store";
import { fetchEditerTreeData } from "../../redux/slices/treesSlice/cases/tests/fetchEditTreeData";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useContainerDimensions } from "../../globalHooks/useContainerDimensions.ts";

export const TreeEdit = () => {
    const params = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const editedTree = useSelector((root: RootState) => root.editedTree);
    const mapRef = useRef(null);
    const { width: famTreeWidth, height: famTreeHeight } = useContainerDimensions(mapRef);

    useEffect(() => {
        dispatch(fetchEditerTreeData(parseInt(params.id || "-1")));
    }, []);
    useEffect(() => {
        const imageSize = 50;
        const nodeSize = 15;

        const focus = d3.select(".plot-area");
        const nodesData = editedTree.nodes.map((d) => ({
            x: d.posX, // Adjust properties accordingly
            y: d.posY,
            ...d,
            // Map other properties based on your actual Node type
        }));
        const linksData = editedTree.connections.map((d) => ({
            index: d.id,
            target: d.to,
            source: d.from,
            ...d,
        }));
        if (!nodesData || !linksData) return;

        // creating entire chart
        const simulation = d3
            .forceSimulation(nodesData)
            .force("charge", d3.forceManyBody().strength(-150))
            .force("x", d3.forceX())
            .force("y", d3.forceY());

        const svg = d3.select(mapRef.current);

        // creating conection between nodes
        const links = focus.selectAll(".link").data(linksData, (d: any) => d.id);

        // Handle the exit selection
        links.exit().remove();

        // Handle the enter selection
        const linkEnter = links
            .enter()
            .append("path")
            .attr("class", "link")
            .style("stroke-width", 1)
            .style("stroke", "#fff")
            .style("fill", "#fff");

        // Merge the enter and existing selections
        const link = linkEnter.merge(links as any);

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
            .enter()
            .append("g")
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
            .style(`stroke`, (d) => (d.famMemId ? `#292929` : "#fff"))
            .style(`fill`, (d) => (d.famMemId ? `#292929` : "#fff"));

        // inserting images into family member nodes
        nodeEnter
            .append("image")
            .attr("xlink:href", (d) => {
                if (d.famMemId) {
                    const [familyMember] = editedTree.members.filter(
                        (member) => member.id === d.famMemId
                    );
                    return familyMember ? familyMember.img_url : "#";
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
                d3.select(this).attr("xlink:href", "path-to-your-fallback-image.jpg");
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
            svg.selectAll(".node")
                .attr("cx", (d: any) => d.x)
                .attr("cy", (d: any) => d.y);
        };

        // defining button to reset position
        const resetPos = () => {
            svg.transition()
                .duration(750)
                .call(zoom.transform as any, d3.zoomIdentity);
            svg.call(zoom as any);
        };
        d3.select("#resetButton").on("click", resetPos);

        simulation.on("tick", updateNodes);

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
        </>
    );
};
