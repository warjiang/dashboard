import Panel from '@/components/panel'
import {useQuery} from "@tanstack/react-query";
import {Button, Input, Space, Table, TableColumnProps, Tag} from "antd";
import {GetNamespaces} from "@/services/namespace.ts";
import type {Namespace} from "@/services/namespace.ts";
import {Icons} from "@/components/icons";
import dayjs from "dayjs";

const NamespacePage = () => {
    const {data, isLoading} = useQuery({
        queryKey: ['GetNamespaces'],
        queryFn: async () => {
            const clusters = await GetNamespaces()
            return clusters.data || {}
        }
    })
    const columns: TableColumnProps<Namespace>[] = [
        {
            title: '命名空间名称',
            key: 'namespaceName',
            width: 200,
            render: (_, r) => {
                return r.objectMeta.name
            }
        },
        {
            title: '标签',
            key: 'label',
            align: 'left',
            render: (_, r) => {
                if (!r?.objectMeta?.labels) {
                    return '-'
                }
                return <div>
                    {
                        Object.keys(r.objectMeta.labels).map(key => <Tag>{key}:{r.objectMeta.labels[key]}</Tag>)
                    }
                </div>
            }
        },
        {
            title: '是否跳过自动调度',
            key: 'skipAutoPropagation',
            render: (_, r) => {
                return r.skipAutoPropagation ?
                    <Tag color='blue'>yes</Tag>:
                    <Tag color='purple'>no</Tag>
            }
        },
        {
            title: '运行状态',
            key: 'phase',
            dataIndex: 'phase',
        },
        {
            title: '创建时间',
            key: 'creationTimestamp',
            render: (_, r) => {
                return dayjs(r.objectMeta.creationTimestamp).format('YYYY/MM/DD HH:mm:ss')
            }
        },
        {
            title: '操作',
            key: 'op',
            width: 200,
            render: () => {
                return <Space.Compact>
                    <Button size={'small'} type='link'>查看</Button>
                    <Button size={'small'} type='link'>编辑</Button>
                    <Button size={'small'} type='link' danger>删除</Button>
                </Space.Compact>
            }
        }
    ]
    return <Panel>
        <div className={'flex flex-row justify-between mb-4'}>
            <Input.Search placeholder={'按命名空间搜索'} className={'w-[400px]'}/>
            <Button
                type={'primary'}
                icon={<Icons.add width={16} height={16}/>}
                className="flex flex-row items-center"
            >
                新增命名空间
            </Button>
        </div>
        <Table
            rowKey={(r: Namespace) => r.objectMeta.name || ''}
            columns={columns}
            loading={isLoading}
            dataSource={data?.namespaces || []}
        />
    </Panel>
}

export default NamespacePage;