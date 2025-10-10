import React from 'react';
import { Modal, Button, Input, Form } from 'antd';
import { Language, t } from '../../utils/translations';

const { TextArea } = Input;

interface QueryProductionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  newQuery: string;
  setNewQuery: (value: string) => void;
  language: Language;
}

const QueryProductionDialog: React.FC<QueryProductionDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  newQuery,
  setNewQuery,
  language
}) => {
  return (
    <Modal
      title={t('addQuery', language)}
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          {t('cancel', language)}
        </Button>,
        <Button key="submit" type="primary" onClick={onSubmit}>
          {t('add', language)}
        </Button>
      ]}
    >
      <Form layout="vertical">
        <Form.Item label={t('queryContent', language)}>
          <TextArea
            rows={4}
            value={newQuery}
            onChange={(e) => setNewQuery(e.target.value)}
            placeholder={t('enterQueryContent', language)}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default QueryProductionDialog;