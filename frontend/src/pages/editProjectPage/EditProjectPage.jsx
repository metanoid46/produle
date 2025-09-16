import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  Space,
  Card,
  Typography,
  Divider,
  message
} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../../API/axiosIOnstance';
import dayjs from 'dayjs';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const EditProjectPage = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const updateWidth = () => setIsMobile(window.innerWidth < 768);
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await API.get(`/projects/${id}`);
        const project = res.data.data;

        if (project.startDate) project.startDate = dayjs(project.startDate);
        if (project.endDate) project.endDate = dayjs(project.endDate);

        const steps = project.steps && project.steps.length > 0
          ? project.steps.sort((a,b)=>a.order-b.order)
          : [{ name: '', status: 'Not Started', order: 1 }];

        form.setFieldsValue({ ...project, steps });
      } catch (err) {
        console.error("Failed to fetch project:", err);
        messageApi.error('Failed to load project data.');
      }
    };

    fetchProject();
  }, [id, form, messageApi]);

  const onFinish = async (values) => {
    try {
      const payload = {
        ...values,
        startDate: values.startDate ? values.startDate.toISOString() : null,
        endDate: values.endDate ? values.endDate.toISOString() : null,
      };

      await API.put(`/projects/${id}`, payload);
      messageApi.success('Project updated successfully!');
      navigate('/home');
    } catch (err) {
      console.error("Failed to update project:", err);
      messageApi.error('Failed to update project.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      {contextHolder}
      <Card style={{ overflow: 'auto', height: '80vh' }}>
        <Title level={3}>Edit Project</Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            priority: 'Low',
            status: 'Not Started',
            steps: [{ name: '', status: 'Not Started', order: 1 }],
          }}
        >
          <Form.Item label="Project Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <div style={{ display: 'flex', gap: '1rem', flexDirection: isMobile ? 'column' : 'row' }}>
            <Form.Item label="Start Date" name="startDate" style={{ flex: 1 }}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item label="End Date" name="endDate" style={{ flex: 1 }}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </div>

          <Form.Item label="Priority" name="priority" rules={[{ required: true }]}>
            <Select>
              <Option value="High">High</Option>
              <Option value="Medium">Medium</Option>
              <Option value="Low">Low</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Description" name="description">
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item label="Status" name="status" rules={[{ required: true }]}>
            <Select>
              <Option value="Not Started">Not Started</Option>
              <Option value="In progress">In progress</Option>
              <Option value="Completed">Completed</Option>
            </Select>
          </Form.Item>

          <Divider>Project Steps</Divider>
          <Form.List name="steps">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }, index) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <div style={{ display: 'flex', gap: '0.5rem', flexDirection: isMobile ? 'column' : 'row', width: '100%' }}>
                      <Form.Item {...restField} name={[name, 'name']} rules={[{ required: true }]}>
                        <Input placeholder={`Step ${index + 1} Name`} />
                      </Form.Item>
                      <Form.Item {...restField} name={[name, 'status']} rules={[{ required: true }]} style={{ flex: 1 }}>
                        <Select>
                          <Option value="Not Started">Not Started</Option>
                          <Option value="In progress">In progress</Option>
                          <Option value="Completed">Completed</Option>
                        </Select>
                      </Form.Item>
                      <Form.Item {...restField} name={[name, 'order']} rules={[{ required: true }]} style={{ width: 80 }}>
                        <Input type="number" placeholder="Order" />
                      </Form.Item>
                    </div>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                    Add Step
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Divider />
          <Form.Item>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Button type="primary" htmlType="submit">Update Project</Button>
              <Button onClick={() => navigate('/home')}>Cancel</Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default EditProjectPage;
