import React from 'react';
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
import { useNavigate } from 'react-router-dom';
import API from '../../API/axiosIOnstance';


const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const isMobile = window.innerWidth < 768;

const AddProjectPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const payload = {
        name: values.name,
        startDate: values.startDate ? values.startDate.format('YYYY-MM-DD') : null,
        endDate: values.endDate ? values.endDate.format('YYYY-MM-DD') : null,
        priority: values.priority,
        description: values.description,
        status: values.status,
        steps: values.steps?.map(step => ({
          name: step.name || '',
          status: step.status || 'Not Started',
          order: step.order || 1,
        })) || [],
      };

      const res = await API.post('/projects/addproject', payload);
      console.log(res.data);
      navigate('/home');
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <Card style={{ overflow: 'auto', height: '80vh' }}>
        <Title level={3} style={{ position: 'sticky' }}>Create New Project</Title>

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
          <Form.Item
            label="Project Name"
            name="name"
            rules={[{ required: true, message: 'Please enter a project name' }]}
          >
            <Input />
          </Form.Item>

          <div style={{ display: 'flex', gap: '1rem', flexDirection: isMobile ? 'column' : 'row' }}>
            <Form.Item label="Start Date" name="startDate">
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item label="End Date" name="endDate">
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
                      <Form.Item
                        {...restField}
                        name={[name, 'name']}
                        rules={[{ required: false, message: 'Enter step name' }]}
                        style={{ flex: 2 }}
                      >
                        <Input placeholder={`Step ${index + 1} Name`} />
                      </Form.Item>

                      <Form.Item {...restField} name={[name, 'status']} style={{ flex: 1 }}>
                        <Select>
                          <Option value="Not Started">Not Started</Option>
                          <Option value="In progress">In progress</Option>
                          <Option value="Completed">Completed</Option>
                        </Select>
                      </Form.Item>

                      <Form.Item {...restField} name={[name, 'order']} style={{ width: 80 }}>
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
              <Button type="primary" htmlType="submit">
                Create Project
              </Button>
              <Button onClick={() => navigate('/home')}>Cancel</Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddProjectPage;
