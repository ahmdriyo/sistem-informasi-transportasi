import { Button, Flex, Modal } from 'antd'
import React from 'react'
import { CheckCircleFilled } from '@ant-design/icons'
import './ModalSucces.css'
interface InputFlashcardModalProps {
  opened: boolean
  onClose: () => void
  title: string
}

export const ModalSucces = ({ opened, onClose, title }: InputFlashcardModalProps) => {
  return (
    <Modal closeIcon={false} open={opened} footer={null} centered className="modal-delete">
      <Flex vertical gap={40} className="modal-delete__container">
        <Flex vertical align="center" gap={28}>
          <CheckCircleFilled style={{ fontSize: '80px', color: '#08c' }} />
          <p className="font-bold text-[15px]">{title}</p>
        </Flex>
        <Flex justify="center" gap={16}>
          <Button variant="solid" shape="round" size="middle" color="blue" onClick={onClose}>
            Next
          </Button>
        </Flex>
      </Flex>
    </Modal>
  )
}
