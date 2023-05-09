import { FileReader } from '@kanaries/web-data-loader'
export async function loadCSVDataset(file: File) {
    const data = await FileReader.csvReader({
        file
    })
}
