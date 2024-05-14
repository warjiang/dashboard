import {IResponse, karmadaClient} from "@/services/base.ts";
import {ObjectMeta, TypeMeta} from '@/services/base'

export interface DeploymentWorkload {
    objectMeta: ObjectMeta
    typeMeta: TypeMeta
    pods: Pods
    containerImages: string[]
    initContainerImages: any
}

export interface Pods {
    current: number
    desired: number
    running: number
    pending: number
    failed: number
    succeeded: number
    warnings: any[]
}

export interface WorkloadStatus {
    running: number,
    pending: number,
    failed: number,
    succeeded: number,
    terminating: number,
}

export async function GetWorkloads(params: {
    namespace?: string
}) {
    const {namespace} = params
    const url = namespace ?
        `/deployment/${namespace}` :
        '/deployment'
    const resp = await karmadaClient.get<IResponse<{
        errors: string[]
        listMeta: {
            totalItems: number
        },
        status: WorkloadStatus,
        deployments: DeploymentWorkload[]
    }>>(
        url
    )
    return resp.data
}
