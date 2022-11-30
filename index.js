const http = require("http");
const path = require("path");
const fs = require("fs/promises");

const PORT = 8000;

const app = http.createServer(async (request, response) => {

    const requestMethod = request.method;
    const requestUrl = request.url
    console.log(requestMethod, requestUrl);

    if (requestUrl == "/apiv1/tasks") {
        const jsonPath = path.resolve("./data.json");
        const jsonFile = await fs.readFile(jsonPath, "utf8");

        if (requestMethod == "GET") {

            response.setHeader("Content-Type", "application/json");
            response.writeHead("200");
            response.write(jsonFile);
        }
        if (requestMethod == "POST") {
            request.on("data", (data) => {
                const parsed = JSON.parse(data);
                const array = JSON.parse(jsonFile);
                array.push(parsed);
                console.log(array);
                const info = JSON.stringify(array);
                fs.writeFile("./data.json", info, "utf8");
                response.writeHead("201");
            })
        }

        if (requestMethod == "PUT") {
            request.on("data", (data) => {
                const task = JSON.parse(data)
                const array = JSON.parse(jsonFile);
                for (let i = 0; i < array.length; i++) {
                    if (task.id == array[i].id) {
                        array.splice(i, 1, task)
                    }
                }
                const info = JSON.stringify(array);
                fs.writeFile("./data.json", info, "utf8");
            })
        }

        if (requestMethod == "DELETE") {
            request.on("data", (data) => {
                const taskDelete = JSON.parse(data);
                const array = JSON.parse(jsonFile);
                for (let i = 0; i < array.length; i++) {
                    if (taskDelete.id == array[i].id) {
                        array.splice(i, 1)
                    }
                }
                const info = JSON.stringify(array);
                fs.writeFile("./data.json", info, "utf8");
            })
        }
    } else {
        response.writeHead("503")
    }

    response.end()
})

app.listen(PORT);

console.log("Corriendo servidor exitosamente")
