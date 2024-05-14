import Panel from '@/components/panel'
import {Button, Input, Select, Space, Table, TableColumnProps, Tag} from "antd";
import {Icons} from "@/components/icons";
import {GetNamespaces,} from '@/services/namespace';
import {GetWorkloads} from '@/services/workload'
import type {DeploymentWorkload} from '@/services/workload'
import {useQuery} from "@tanstack/react-query";
import {useMemo} from "react";
import {DeleteResource} from "@/services/unstructured.ts";
/*
propagationpolicy.karmada.io/name: "nginx-propagation"
propagationpolicy.karmada.io/namespace: "default"
*/
const propagationpolicyKey = 'propagationpolicy.karmada.io/name'
const WorkloadPage = () => {
    const {data:nsData} = useQuery({
        queryKey: ['GetNamespaces'],
        queryFn: async () => {
            const clusters = await GetNamespaces()
            return clusters.data || {}
        }
    })
    const nsOptions = useMemo(() => {
        if(!nsData?.namespaces) return[]
        return nsData.namespaces.map(item => {
            return {
                title: item.objectMeta.name,
                value: item.objectMeta.name
            }
        })
    }, [nsData]);
    const {data,isLoading} = useQuery({
        queryKey: ['GetWorkloads'],
        queryFn: async () => {
            const clusters = await GetWorkloads({})
            return clusters.data || {}
        }
    })
    console.log('data', data?.deployments)
    const columns: TableColumnProps<DeploymentWorkload>[] = [
        {
            title: '命名空间',
            key: 'namespaceName',
            width: 200,
            render: (_, r) => {
                return r.objectMeta.namespace
            }
        },
        {
            title: '负载名称',
            key: 'workloadName',
            width: 200,
            render: (_, r) => {
                return r.objectMeta.name
            }
        },
        {
            title: '标签信息',
            key: 'labelName',
            align: 'left',
            width: '30%',
            render: (_, r) => {
                if (!r?.objectMeta?.labels) {
                    return '-'
                }
                return <div className='flex flex-wrap'>
                    {
                        Object.keys(r.objectMeta.labels).map(key =>
                            <Tag
                                className={'mb-2'}
                                key={`${r.objectMeta.name}-${key}`}>
                                {key}:{r.objectMeta.labels[key]}
                            </Tag>)
                    }
                </div>
            }
        },
        {
            title: '分发策略',
            key: 'propagationPolicies',
            render: (_, r) => {
                if (!r?.objectMeta?.annotations?.[propagationpolicyKey]) {
                    return '-'
                }
                return <Tag>{r?.objectMeta?.annotations?.[propagationpolicyKey]}</Tag>
            }
        },
        {
            title: '覆盖策略',
            key: 'overridePolicies',
            render: () => {
                return '-'
            }
        },
        {
            title: '操作',
            key: 'op',
            width: 200,
            render: (_, r) => {
                return <Space.Compact>
                    <Button size={'small'} type='link'>查看</Button>
                    <Button size={'small'} type='link'>编辑</Button>
                    <Button
                        size={'small'} type='link' danger
                        onClick={async () => {
                            const ret = await DeleteResource({
                                kind: r.typeMeta.kind,
                                name: r.objectMeta.name
                            })
                            if (ret.code === 200) {
                            } else {
                            }
                        }}>
                        删除
                    </Button>
                </Space.Compact>
            }
        }
    ]
    return <Panel>
        <div className={'flex flex-row justify-between mb-4'}>
            <div className={'flex flex-row justify-center space-x-4'}>
                <h3 className={'leading-[32px]'}>命名空间：</h3>
                <Select options={nsOptions} className={'w-[300px]'}/>
                <Input.Search placeholder={'按命名空间搜索'} className={'w-[400px]'}/>
            </div>

            <Button
                type={'primary'}
                icon={<Icons.add width={16} height={16}/>}
                className="flex flex-row items-center"
                onClick={() => {
                }}
            >
                新增工作负载
            </Button>
        </div>
        <Table
            rowKey={(r: DeploymentWorkload) => r.objectMeta.name || ''}
            columns={columns}
            loading={isLoading}
            dataSource={data?.deployments || []}
        />
    </Panel>
}

export default WorkloadPage;