export const getImage = (token: string, url: string) =>
    new Promise<Blob>((res, rej) => {
        fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((data) => {
                console.log(data);
                data.blob()
                    .then((blb) => res(blb))
                    .catch((err) => {
                        console.error(err);
                        rej("failed to get image");
                    });
            })
            .catch((err) => {
                console.error(err);
                rej("failed to get image");
            });
    });
