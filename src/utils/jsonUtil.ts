import fs from "node:fs"

// Define an async function to read a JSON file as a JSON object
export async function readJSONFileAsObject(filePath: string): Promise<any> {
    if (fs.existsSync(filePath)) {
        const buffer = await fs.promises.readFile(filePath);
        const jsonString = buffer.toString();
        const jsonObject = JSON.parse(jsonString);
        return jsonObject
    } else {
        // Handle the case when the file does not exist
        console.log("File not found");
        return {}
    }
}

export function convertToMap(obj: any): Map<any, any> {
    const map = new Map<any, any>();
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'object' && value !== null) {
            // If the value is an object, convert it to a Map as well
            map.set(key, convertToMap(value));
        } else {
            // Otherwise, just set the key and value as they are
            map.set(key, value);
        }
    }
    return map;
}

// Define an async function to write a Map object or an Object into a JSON file 
export async function writeObjectToJSONFile(object: Map<string, any> | Record<string, any>, filePath: string): Promise<void> {
    // Convert the object to a JSON string 
    const jsonString = JSON.stringify(object);
    // Use fs.promises.writeFile to write the JSON string to the file 
    await fs.promises.writeFile(filePath, jsonString, `utf8`);
}