'use client';

import React from 'react';
import { Typography } from 'antd';

interface MarkdownRendererProps {
    content: string;
    className?: string;
    style?: React.CSSProperties;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ 
    content, 
    className = '',
    style = {}
}) => {
    if (!content) {
        return (
            <Typography.Paragraph type="secondary" style={{ fontStyle: 'italic', ...style }}>
                Nội dung sẽ hiển thị tại đây...
            </Typography.Paragraph>
        );
    }

    const formatInlineText = (text: string) => {
        let formatted = text.replace(/`([^`]+)`/g, '<code style="background: #f3f4f6; padding: 2px 6px; border-radius: 3px; font-family: SFMono-Regular, Consolas, \\"Liberation Mono\\", Menlo, monospace; font-size: 85%; color: #d73a49;">$1</code>');

        formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

        formatted = formatted.replace(/\*([^*]+)\*/g, '<em>$1</em>');

        formatted = formatted.replace(/~~([^~]+)~~/g, '<del>$1</del>');

        formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color: #0366d6; text-decoration: none;" target="_blank" rel="noopener noreferrer">$1</a>');

        return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
    };

    const renderContent = () => {
        const lines = content.split('\n');
        const renderedLines: React.ReactNode[] = [];
        let inCodeBlock = false;
        let codeBlockContent: string[] = [];
        let codeBlockLanguage = '';

        lines.forEach((line, index) => {
            if (line.startsWith('```')) {
                if (!inCodeBlock) {
                    inCodeBlock = true;
                    codeBlockLanguage = line.substring(3).trim();
                    codeBlockContent = [];
                } else {
                    inCodeBlock = false;
                    renderedLines.push(
                        <div key={`code-${index}`} style={{ 
                            background: '#f6f8fa', 
                            border: '1px solid #e1e4e8',
                            padding: '16px', 
                            borderRadius: '6px', 
                            margin: '16px 0', 
                            fontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
                            fontSize: '14px',
                            lineHeight: '1.45',
                            overflow: 'auto'
                        }}>
                            {codeBlockLanguage && (
                                <div style={{ 
                                    color: '#586069', 
                                    fontSize: '12px', 
                                    marginBottom: '8px',
                                    fontWeight: '600'
                                }}>
                                    {codeBlockLanguage}
                                </div>
                            )}
                            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                                {codeBlockContent.join('\n')}
                            </pre>
                        </div>
                    );
                    codeBlockContent = [];
                }
                return;
            }

            if (inCodeBlock) {
                codeBlockContent.push(line);
                return;
            }

            if (line.startsWith('# ')) {
                renderedLines.push(
                    <h1 key={index} style={{ 
                        fontSize: '2em', 
                        fontWeight: '600', 
                        marginTop: '24px', 
                        marginBottom: '16px',
                        borderBottom: '1px solid #eaecef',
                        paddingBottom: '10px'
                    }}>
                        {line.substring(2)}
                    </h1>
                );
                return;
            }
            if (line.startsWith('## ')) {
                renderedLines.push(
                    <h2 key={index} style={{ 
                        fontSize: '1.5em', 
                        fontWeight: '600', 
                        marginTop: '24px', 
                        marginBottom: '16px',
                        borderBottom: '1px solid #eaecef',
                        paddingBottom: '8px'
                    }}>
                        {line.substring(3)}
                    </h2>
                );
                return;
            }
            if (line.startsWith('### ')) {
                renderedLines.push(
                    <h3 key={index} style={{ 
                        fontSize: '1.25em', 
                        fontWeight: '600', 
                        marginTop: '20px', 
                        marginBottom: '12px'
                    }}>
                        {line.substring(4)}
                    </h3>
                );
                return;
            }
            if (line.startsWith('#### ')) {
                renderedLines.push(
                    <h4 key={index} style={{ 
                        fontSize: '1em', 
                        fontWeight: '600', 
                        marginTop: '16px', 
                        marginBottom: '8px'
                    }}>
                        {line.substring(5)}
                    </h4>
                );
                return;
            }

            if (line.match(/^[\s]*[-\*\+]\s/)) {
                const indentLevel = (line.match(/^(\s*)/)?.[1]?.length || 0) / 2;
                const listItem = line.replace(/^[\s]*[-\*\+]\s/, '');
                renderedLines.push(
                    <ul key={index} style={{ 
                        marginLeft: `${indentLevel * 20}px`,
                        marginBottom: '8px'
                    }}>
                        <li style={{ marginBottom: '4px' }}>
                            {formatInlineText(listItem)}
                        </li>
                    </ul>
                );
                return;
            }

            if (line.match(/^[\s]*\d+\.\s/)) {
                const indentLevel = (line.match(/^(\s*)/)?.[1]?.length || 0) / 2;
                const listItem = line.replace(/^[\s]*\d+\.\s/, '');
                renderedLines.push(
                    <ol key={index} style={{ 
                        marginLeft: `${indentLevel * 20}px`,
                        marginBottom: '8px'
                    }}>
                        <li style={{ marginBottom: '4px' }}>
                            {formatInlineText(listItem)}
                        </li>
                    </ol>
                );
                return;
            }

            if (line.startsWith('> ')) {
                renderedLines.push(
                    <blockquote key={index} style={{
                        borderLeft: '4px solid #dfe2e5',
                        paddingLeft: '16px',
                        margin: '16px 0',
                        color: '#6a737d',
                        fontStyle: 'italic'
                    }}>
                        {formatInlineText(line.substring(2))}
                    </blockquote>
                );
                return;
            }

            if (line.trim() === '---' || line.trim() === '***') {
                renderedLines.push(
                    <hr key={index} style={{
                        border: 'none',
                        borderTop: '1px solid #eaecef',
                        margin: '24px 0'
                    }} />
                );
                return;
            }

            if (line.trim() === '') {
                renderedLines.push(<br key={index} />);
                return;
            }

            renderedLines.push(
                <p key={index} style={{ 
                    marginBottom: '16px', 
                    lineHeight: '1.6',
                    color: '#24292e'
                }}>
                    {formatInlineText(line)}
                </p>
            );
        });

        return renderedLines;
    };

    return (
        <div 
            className={className} 
            style={{ fontSize: '16px', lineHeight: '1.8', ...style }}
        >
            {renderContent()}
        </div>
    );
};

export default MarkdownRenderer;
