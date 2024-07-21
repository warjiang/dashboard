import { FC } from 'react';
import { Dropdown, Tag } from 'antd';

interface ITagListProps {
  tags: {
    key: string;
    value: string;
  }[];
  maxLen?: number;
}

const TagList: FC<ITagListProps> = (props) => {
  const { tags = [], maxLen = Infinity } = props;
  return (
    <>
      {tags.length === 0 ? (
        '-'
      ) : tags.length <= maxLen ? (
        tags.map((t) => <Tag key={t.key}>{t.value}</Tag>)
      ) : (
        <div className={'flex flex-row'}>
          <div>
            {tags.slice(0, maxLen).map((t) => (
              <Tag key={t.key}>{t.value}</Tag>
            ))}
          </div>
          <Dropdown
            menu={{
              items: tags.slice(maxLen).map((t) => ({
                key: t.key,
                label: <Tag>{t.value}</Tag>,
              })),
            }}
          >
            <Tag>+1</Tag>
          </Dropdown>
        </div>
      )}
    </>
  );
};

export default TagList;
