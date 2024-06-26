import i18nInstance from '@/utils/i18n';
import { FC, useEffect, useState } from 'react';
import { Modal, Form, Input, Radio, Button, Select, Divider } from 'antd';
import TextareaWithUpload from '@/components/textarea-with-upload';
import { Icons } from '@/components/icons';
import {
  ClusterDetail,
  CreateCluster,
  UpdateCluster,
} from '@/services/cluster';
import type { LabelParam, TaintParam } from '@/services/cluster';
import { IResponse } from '@/services/base.ts';

export interface NewClusterModalProps {
  mode: 'create' | 'edit';
  open: boolean;
  onOk: (ret: IResponse<any>) => void;
  onCancel: () => void;
  clusterDetail?: ClusterDetail;
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 4 },
  },
};

const NewClusterModal: FC<NewClusterModalProps> = (props) => {
  const { mode, open, onOk, onCancel, clusterDetail } = props;
  const [form] = Form.useForm<{
    clusterName: string;
    mode: 'Pull' | 'Push';
    kubeconfig: string;
    labels: LabelParam[];
    taints: TaintParam[];
  }>();
  const [showAdvancedConfig, setShowAdvancedConfig] = useState(
    mode !== 'create',
  );
  const [confirmLoading, setConfirmLoading] = useState(false);
  useEffect(() => {
    setShowAdvancedConfig(mode !== 'create');
  }, [mode]);
  useEffect(() => {
    if (mode === 'edit') {
      const initData = {
        clusterName: clusterDetail?.objectMeta?.name,
        mode: clusterDetail?.syncMode,
        taints: clusterDetail?.taints,
        labels: [] as LabelParam[],
      };
      if (clusterDetail?.objectMeta?.labels) {
        initData['labels'] = Object.keys(clusterDetail?.objectMeta?.labels).map(
          (k) => {
            return {
              key: k,
              value: clusterDetail?.objectMeta?.labels?.[k] || '',
            } as LabelParam;
          },
        );
      }
      form.setFieldsValue(initData);
    }
  }, [mode, clusterDetail, form]);
  return (
    <Modal
      open={open}
      title={
        mode === 'create'
          ? i18nInstance.t('4cd980b26c5c76cdd4a5c5e44064d6da')
          : i18nInstance.t('8d3d771ab6d38cf457a832763a5203a0')
      }
      width={800}
      okText={i18nInstance.t('38cf16f2204ffab8a6e0187070558721')}
      cancelText={i18nInstance.t('625fb26b4b3340f7872b411f401e754c')}
      destroyOnClose={true}
      confirmLoading={confirmLoading}
      onOk={async () => {
        try {
          setConfirmLoading(true);
          const submitData = await form.validateFields();
          if (mode === 'edit') {
            const ret = await UpdateCluster({
              clusterName: submitData.clusterName,
              labels: submitData.labels,
              taints: submitData.taints,
            });
            onOk(ret);
          } else if (mode === 'create') {
            const ret = await CreateCluster({
              clusterName: submitData.clusterName,
              kubeconfig: submitData.kubeconfig,
              mode: submitData.mode,
            });
            onOk(ret);
          }
        } catch (e) {
          console.log('e', e);
        } finally {
          setConfirmLoading(false);
        }
      }}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
    >
      <Form
        form={form}
        className={mode === 'create' ? 'min-h-[500px]' : 'min-h-[200px]'}
        validateMessages={{
          required: i18nInstance.t('e0a23c19b8a0044c5defd167b441d643'),
        }}
      >
        <Form.Item
          label={i18nInstance.t('c3f28b34bbdec501802fa403584267e6')}
          name="clusterName"
          required
          rules={[{ required: true }]}
          {...formItemLayout}
        >
          <Input
            placeholder={i18nInstance.t('debdfce08462b0261ed58925fe915450')}
            disabled={mode !== 'create'}
            className={'w-[200px]'}
          />
        </Form.Item>
        <Form.Item
          label={i18nInstance.t('e8d733d77271dd37b33820f5eafeb2c2')}
          name="mode"
          required
          {...formItemLayout}
        >
          <Radio.Group disabled={mode !== 'create'}>
            <Radio value={'Push'}>Push</Radio>
            <Radio value={'Pull'}>Pull</Radio>
          </Radio.Group>
        </Form.Item>
        {mode === 'create' && (
          <Form.Item
            label="kubeconfig"
            name="kubeconfig"
            required
            rules={[{ required: true, message: '${label} is required' }]}
            {...formItemLayout}
          >
            <TextareaWithUpload
              height="300px"
              // width="500px"
              defaultLanguage="yaml"
              theme={'vs-dark'}
              options={{
                minimap: {
                  enabled: false,
                },
              }}
              // placeholder={'请输入被管集群的kubeconfig配置文件'}
              checkContent={(data) => {
                if (data.err) return false;
                return (data.data as string).indexOf('server:') !== -1;
              }}
            />
          </Form.Item>
        )}

        <Divider>
          <div
            className={'flex flex-row items-center space-x-4 cursor-pointer'}
            onClick={() => {
              setShowAdvancedConfig(!showAdvancedConfig);
            }}
          >
            <span>{i18nInstance.t('1f318234cab713b51b5172d91770bc11')}</span>
            <Icons.up
              width={16}
              height={16}
              className={'transition duration-500'}
              style={{
                transform: showAdvancedConfig ? 'rotate(180deg)' : 'none',
              }}
            />
          </div>
        </Divider>
        <div
          className={'transition-all duration-500'}
          style={{
            // visibility: showAdvancedConfig ? 'visible' : 'hidden'
            // height: showAdvancedConfig ? 'auto' : 0
            maxHeight: showAdvancedConfig ? '1000px' : '0',
            overflow: 'hidden',
          }}
        >
          <Form.List name="labels">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name }, index) => (
                  <Form.Item
                    {...(index === 0
                      ? formItemLayout
                      : formItemLayoutWithOutLabel)}
                    label={
                      index === 0
                        ? i18nInstance.t('b5a42b0552078d909538b09290dac33b')
                        : ''
                    }
                    required
                    key={key}
                  >
                    <div className={'flex flex-row items-center space-x-4'}>
                      <Form.Item
                        name={[name, 'key']}
                        rules={[
                          {
                            required: true,
                            message: i18nInstance.t(
                              '645e18caca231e11428f48afbcc33f12',
                            ),
                          },
                        ]}
                        noStyle
                      >
                        <Input
                          placeholder={i18nInstance.t(
                            '38fe9f04343da51a22f32b08fda176e2',
                          )}
                          className={'w-[150px]'}
                        />
                      </Form.Item>
                      <Form.Item
                        name={[name, 'value']}
                        rules={[
                          {
                            required: true,
                            message: i18nInstance.t(
                              '95ef866ba7b4dccef30d67b9d0573f4c',
                            ),
                          },
                        ]}
                        noStyle
                      >
                        <Input
                          placeholder={i18nInstance.t(
                            '8728e41e53f5447795926bfe80e547df',
                          )}
                          className={'w-[150px]'}
                        />
                      </Form.Item>
                      <Button
                        onClick={() => remove(name)}
                        icon={<Icons.delete width={16} height={16} />}
                        className="flex flex-row items-center border-none"
                      />
                    </div>
                  </Form.Item>
                ))}
                <Form.Item {...formItemLayoutWithOutLabel}>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<Icons.add />}
                    className="flex flex-row items-center justify-center h-[32px]"
                  >
                    {i18nInstance.t('c1153b413b26be76aa95cce9ce3ce588')}
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.List name="taints">
            {(fields, { add, remove }) => {
              return (
                <>
                  {fields.map((field, index) => {
                    return (
                      <Form.Item
                        {...(index === 0
                          ? formItemLayout
                          : formItemLayoutWithOutLabel)}
                        label={
                          index === 0
                            ? i18nInstance.t('7e9edd6aac5f7394babb5825093d0b2f')
                            : ''
                        }
                        required
                        key={field.key}
                      >
                        <div className={'flex flex-row items-center space-x-4'}>
                          <Form.Item
                            name={[field.name, 'key']}
                            rules={[{ required: true }]}
                            noStyle
                          >
                            <Input
                              placeholder={i18nInstance.t(
                                'af4d4438625e0bd7915a63a9cf48d6cb',
                              )}
                              className={'w-[200px]'}
                            />
                          </Form.Item>
                          {/*
                                                 <Form.Item
                                                     name={[field.name, 'operator']}
                                                     noStyle
                                                 >
                                                     <Select
                                                         style={{width: 100}}
                                                         options={[
                                                             {label: '=', value: '='},
                                                             {label: 'none', value: 'none'},
                                                         ]}
                                                     />
                                                 </Form.Item>
                                                 */}
                          <Form.Item
                            name={[field.name, 'value']}
                            rules={[{ required: true }]}
                            noStyle
                          >
                            <Input
                              placeholder={i18nInstance.t(
                                'dc74ee6676ae5689ef91a6a1f6ca4e17',
                              )}
                              className={'w-[200px]'}
                            />
                          </Form.Item>
                          <Form.Item
                            name={[field.name, 'effect']}
                            rules={[{ required: true }]}
                            noStyle
                          >
                            <Select
                              style={{
                                width: 240,
                              }}
                              options={[
                                {
                                  label: 'NoSchedule',
                                  value: 'NoSchedule',
                                },
                                {
                                  label: 'PreferNoSchedule',
                                  value: 'PreferNoSchedule',
                                },
                                {
                                  label: 'NoExecute',
                                  value: 'NoExecute',
                                },
                              ]}
                            />
                          </Form.Item>
                          <Button
                            onClick={() => {
                              remove(field.name);
                            }}
                            icon={<Icons.delete width={16} height={16} />}
                            className="flex flex-row items-center border-none"
                          />
                        </div>
                      </Form.Item>
                    );
                  })}
                  <Form.Item {...formItemLayoutWithOutLabel}>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<Icons.add />}
                      className="flex flex-row items-center justify-center h-[32px]"
                    >
                      {i18nInstance.t('a8c0e7f3a8bbae7c553d25aab4f68978')}
                    </Button>
                  </Form.Item>
                </>
              );
            }}
          </Form.List>
        </div>
      </Form>
    </Modal>
  );
};

export default NewClusterModal;
