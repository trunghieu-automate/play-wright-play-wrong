import fs from "node:fs"

// Define an async function to read a JSON file as a JSON object
export async function readJSONFileAsObject(filePath: string): Promise<any> {
    const buffer = await fs.promises.readFile(filePath);
    const jsonString = buffer.toString();
    const jsonObject = JSON.parse(jsonString); 
    return jsonObject;
}

// Define an async function to read a JSON file as a Map object 
export async function readJSONFileAsMap(filePath: string): Promise<Map<string, any>> {
    const jsonObject = await readJSONFileAsObject(filePath);
    const mapObject = new Map<string, any>(); for (const [key, value] of Object.entries(jsonObject)) {
        mapObject.set(key, value);
    }
    return mapObject;
}

// Define an async function to write a Map object or an Object into a JSON file 
export async function writeObjectToJSONFile(object: Map<string, any> | Record<string, any>, filePath: string): Promise<void> {
    // Convert the object to a JSON string 
    const jsonString = JSON.stringify(object);
    // Use fs.promises.writeFile to write the JSON string to the file 
    await fs.promises.writeFile(filePath, jsonString, `utf8`);
}