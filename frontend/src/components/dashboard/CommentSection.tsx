'use client';
import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Button,
  Input,
  List,
  Avatar,
  Typography,
  Space,
  Divider,
  App,
  Popconfirm,
  Dropdown,
  Menu
} from 'antd';
import {
  LikeOutlined,
  DislikeOutlined,
  CommentOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  LikeFilled,
  DislikeFilled
} from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { api } from '../../utils/api';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';

dayjs.extend(relativeTime);
dayjs.locale('vi');

const { TextArea } = Input;
const { Text, Link } = Typography;

interface Comment {
  _id: string;
  content: string;
  authorId: {
    _id: string;
    username: string;
    email: string;
    profile?: {
      avatar: string;
      bio: string;
    };
  };
  postId: string;
  parentId?: string[];
  replies: Comment[];
  upvotes: string[];
  downvotes: string[];
  createdAt: string;
  updatedAt: string;
}

interface CommentSectionProps {
  postId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [replyForm] = Form.useForm();
  const { data: session } = useSession();
  const router = useRouter();
  const { message } = App.useApp();

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/comments/post/${postId}`);
      const commentsData = response.data as { data: Comment[] };
      setComments(commentsData.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
      message.error('Không thể tải bình luận');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (values: { content: string }) => {
    if (!session) {
      message.error('Vui lòng đăng nhập để bình luận');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/comments', {
        content: values.content,
        postId: postId
      });
      message.success('Bình luận đã được thêm');
      form.resetFields();
      fetchComments();
    } catch (error) {
      console.error('Error posting comment:', error);
      message.error('Không thể thêm bình luận');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (values: { content: string }, parentId: string) => {
    if (!session) {
      message.error('Vui lòng đăng nhập để trả lời');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/comments', {
        content: values.content,
        postId: postId,
        parentId: parentId
      });
      message.success('Trả lời đã được thêm');
      setReplyingTo(null);
      replyForm.resetFields();
      fetchComments();
    } catch (error) {
      console.error('Error posting reply:', error);
      message.error('Không thể thêm trả lời');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditComment = async (values: { content: string }, commentId: string) => {
    setSubmitting(true);
    try {
      await api.patch(`/comments/${commentId}`, {
        content: values.content
      });
      message.success('Bình luận đã được cập nhật');
      setEditingComment(null);
      editForm.resetFields();
      fetchComments();
    } catch (error) {
      console.error('Error editing comment:', error);
      message.error('Không thể cập nhật bình luận');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await api.delete(`/comments/${commentId}`);
      message.success('Bình luận đã được xóa');
      fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
      message.error('Không thể xóa bình luận');
    }
  };

  const handleUpvote = async (commentId: string) => {
    if (!session) {
      message.error('Vui lòng đăng nhập để vote');
      return;
    }

    try {
      await api.post(`/comments/${commentId}/upvote`);
      fetchComments();
    } catch (error) {
      console.error('Error upvoting comment:', error);
      message.error('Không thể vote bình luận');
    }
  };

  const handleDownvote = async (commentId: string) => {
    if (!session) {
      message.error('Vui lòng đăng nhập để vote');
      return;
    }

    try {
      await api.post(`/comments/${commentId}/downvote`);
      fetchComments();
    } catch (error) {
      console.error('Error downvoting comment:', error);
      message.error('Không thể vote bình luận');
    }
  };

  const handleUsernameClick = (userId: string) => {
    router.push(`/dashboard/profile/${userId}`);
  };

  const isUserComment = (comment: Comment) => {
    return session?.user?._id === comment.authorId._id;
  };

  const hasUserUpvoted = (comment: Comment) => {
    return comment.upvotes.includes(session?.user?._id || '');
  };

  const hasUserDownvoted = (comment: Comment) => {
    return comment.downvotes.includes(session?.user?._id || '');
  };

  const renderComment = (comment: Comment, isReply: boolean = false) => {
    const isEditing = editingComment === comment._id;
    const isReplying = replyingTo === comment._id;

    const actions = [
      <Space key="vote">
        <Button
          type="text"
          size="small"
          icon={hasUserUpvoted(comment) ? <LikeFilled /> : <LikeOutlined />}
          onClick={() => handleUpvote(comment._id)}
        >
          {comment.upvotes.length}
        </Button>
        <Button
          type="text"
          size="small"
          icon={hasUserDownvoted(comment) ? <DislikeFilled /> : <DislikeOutlined />}
          onClick={() => handleDownvote(comment._id)}
        >
          {comment.downvotes.length}
        </Button>
      </Space>,
      <Button
        key="reply"
        type="text"
        size="small"
        icon={<CommentOutlined />}
        onClick={() => setReplyingTo(comment._id)}
        disabled={isReply} // Không cho phép reply của reply
      >
        Trả lời
      </Button>
    ];

    if (isUserComment(comment)) {
      actions.push(
        <Dropdown
          key="more"
          menu={{
            items: [
              {
                key: 'edit',
                label: 'Chỉnh sửa',
                icon: <EditOutlined />,
                onClick: () => {
                  setEditingComment(comment._id);
                  editForm.setFieldsValue({ content: comment.content });
                }
              },
              {
                key: 'delete',
                label: 'Xóa',
                icon: <DeleteOutlined />,
                danger: true,
                onClick: () => handleDeleteComment(comment._id)
              }
            ]
          }}
          trigger={['click']}
        >
          <Button type="text" size="small" icon={<MoreOutlined />} />
        </Dropdown>
      );
    }

    return (
      <div key={comment._id} style={{ marginBottom: 16 }}>
        <List.Item actions={actions}>
          <List.Item.Meta
            avatar={
              <Avatar 
                src={comment.authorId.profile?.avatar} 
                size="default"
              >
                {comment.authorId.username.charAt(0).toUpperCase()}
              </Avatar>
            }
            title={
              <Space>
                <Link 
                  onClick={() => handleUsernameClick(comment.authorId._id)}
                  style={{ cursor: 'pointer' }}
                >
                  {comment.authorId.username}
                </Link>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {dayjs(comment.createdAt).fromNow()}
                </Text>
              </Space>
            }
            description={
              isEditing ? (
                <Form
                  form={editForm}
                  onFinish={(values) => handleEditComment(values, comment._id)}
                  style={{ marginTop: 8 }}
                >
                  <Form.Item
                    name="content"
                    rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
                  >
                    <TextArea
                      rows={3}
                      placeholder="Nhập nội dung bình luận..."
                    />
                  </Form.Item>
                  <Form.Item>
                    <Space>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={submitting}
                        size="small"
                      >
                        Cập nhật
                      </Button>
                      <Button
                        onClick={() => {
                          setEditingComment(null);
                          editForm.resetFields();
                        }}
                        size="small"
                      >
                        Hủy
                      </Button>
                    </Space>
                  </Form.Item>
                </Form>
              ) : (
                <Text>{comment.content}</Text>
              )
            }
          />
        </List.Item>

        {/* Reply Form */}
        {isReplying && (
          <div style={{ marginLeft: 40, marginTop: 8 }}>
            <Form
              form={replyForm}
              onFinish={(values) => handleReply(values, comment._id)}
            >
              <Form.Item
                name="content"
                rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
              >
                <TextArea
                  rows={3}
                  placeholder="Nhập nội dung trả lời..."
                />
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={submitting}
                    size="small"
                  >
                    Trả lời
                  </Button>
                  <Button
                    onClick={() => {
                      setReplyingTo(null);
                      replyForm.resetFields();
                    }}
                    size="small"
                  >
                    Hủy
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </div>
        )}

        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div style={{ marginLeft: 40, marginTop: 8 }}>
            <Divider style={{ margin: '8px 0' }} />
            {comment.replies.map(reply => renderComment(reply, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card title="Bình luận" style={{ marginTop: 24 }}>
      {/* Comment Form */}
      {session ? (
        <Form
          form={form}
          onFinish={handleSubmitComment}
          style={{ marginBottom: 24 }}
        >
          <Form.Item
            name="content"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
          >
            <TextArea
              rows={4}
              placeholder="Viết bình luận của bạn..."
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
            >
              Đăng bình luận
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <div style={{ textAlign: 'center', padding: '20px 0', marginBottom: 24 }}>
          <Text type="secondary">
            Vui lòng đăng nhập để bình luận
          </Text>
        </div>
      )}

      <Divider />

      {/* Comments List */}
      <List
        loading={loading}
        dataSource={comments}
        renderItem={comment => renderComment(comment)}
        locale={{
          emptyText: 'Chưa có bình luận nào'
        }}
      />
    </Card>
  );
};

export default CommentSection;
