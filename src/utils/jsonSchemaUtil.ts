import Ajv from "ajv"
// Validate any JSON data against any JSON schema using ajv
export async function validateJson(data: any, schema: any): Promise<boolean> {
    const ajv = new Ajv()
    const validate = ajv.compile(schema);

    const valid = validate(data);
    if (valid){
        return true
    } else {
        console.log(validate.errors)
        return false
    }

} 

// Get an array of validation error messages if the validation fails
export function getValidationErrors(data: any, schema: any): string[] {
    const ajv = new Ajv()
    const validate = ajv.compile(schema);
    const valid = validate(data);
    if (!valid) {
        return validate.errors.map((error) => `${error.instancePath} ${error.message}`);
    }
    return [];
}
