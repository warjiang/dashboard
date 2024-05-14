import {IResponse, karmadaClient, ObjectMeta, TypeMeta} from './base';

export interface Namespace {
    objectMeta: ObjectMeta
    typeMeta: TypeMeta
    phase: string
    skipAutoPropagation: boolean
}

export async function GetNamespaces() {
    const resp = await karmadaClient.get<IResponse<{
        errors: string[]
        listMeta: {
            totalItems: number
        }
        namespaces:Namespace[]
    }>>(
        "/namespace"
    )
    return resp.data
}