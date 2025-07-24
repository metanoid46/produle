import React, { useEffect } from 'react';
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
} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../../API/axiosIOnstance';
import dayjs from 'dayjs'; // for date formatting

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const isMobile = window.innerWidth < 768;

const EditProjectPage = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // ✅ Fetch project data on mount
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await API.get(`/projects/${id}`);
        const project = res.data.data;

        // Format date fields for DatePicker
        if (project.startDate) project.startDate = dayjs(project.startDate);
        if (project.endDate) project.endDate = dayjs(project.endDate);

        form.setFieldsValue(project);
      } catch (err) {
        console.error("Failed to fetch project:", err);
      }
    };

    fetchProject();
  }, [id, form]);

  const onFinish = async (values) => {
    try {
      await API.put(`/projects/${id}`, values);
      navigate('/home');
    } catch (err) {
      console.error("Failed to update project:", err);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
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
          {/* Project Name */}
          <Form.Item label="Project Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          {/* Dates */}
          <div style={{ display: 'flex', gap: '2rem' }}>
            <Form.Item label="Start Date" name="startDate">
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item label="End Date" name="endDate">
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </div>

          {/* Priority */}
          <Form.Item label="Priority" name="priority" rules={[{ required: true }]}>
            <Select>
              <Option value="High">High</Option>
              <Option value="Medium">Medium</Option>
              <Option value="Low">Low</Option>
            </Select>
          </Form.Item>

          {/* Description */}
          <Form.Item label="Description" name="description">
            <TextArea rows={4} />
          </Form.Item>

          {/* Status */}
          <Form.Item label="Status" name="status" rules={[{ required: true }]}>
            <Select>
              <Option value="Not Started">Not Started</Option>
              <Option value="In progress">In progress</Option>
              <Option value="Completed">Completed</Option>
            </Select>
          </Form.Item>

          {/* Steps */}
          <Divider>Project Steps</Divider>
          <Form.List name="steps">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }, index) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <div style={{ width: '100%', display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '1rem' }}>
                      <Form.Item {...restField} name={[name, 'name']} rules={[{ required: true }]}>
                        <Input placeholder={`Step ${index + 1} Name`} />
                      </Form.Item>
                      <Form.Item {...restField} name={[name, 'status']} rules={[{ required: true }]}>
                        <Select style={{ width: 150 }}>
                          <Option value="Not Started">Not Started</Option>
                          <Option value="In progress">In progress</Option>
                          <Option value="Completed">Completed</Option>
                        </Select>
                      </Form.Item>
                      <Form.Item {...restField} name={[name, 'order']} rules={[{ required: true }]}>
                        <Input type="number" placeholder="Order" style={{ width: 80 }} />
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

          {/* Submit */}
          <Divider />
          <Form.Item>
            <div style={{ display: 'flex', gap: '2vw' }}>
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
