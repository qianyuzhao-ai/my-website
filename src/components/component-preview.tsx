"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function ComponentPreview() {
  const [message, setMessage] = useState(
    "点击按钮，查看交互反馈。以下均为本地示例。",
  );
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [formMessage, setFormMessage] = useState("");

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <h3 className="text-h3 font-semibold">Button</h3>
        <div className="preview-stage flex-col items-stretch">
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={() => setMessage("已触发主操作。")}>
              主要操作
            </Button>
            <Button
              variant="secondary"
              onClick={() => setMessage("已取消本次操作。")}
            >
              取消
            </Button>
            <Button
              variant="ghost"
              onClick={() => setMessage("Ghost 适用于工具栏和行内操作。")}
            >
              了解更多
            </Button>
            <Button
              variant="danger"
              onClick={() =>
                setMessage("危险操作样式预览。实际删除操作应先显示确认弹窗。")
              }
            >
              危险操作
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {(["sm", "md", "lg"] as const).map((size) => (
              <Button
                key={size}
                variant="secondary"
                size={size}
                onClick={() =>
                  setMessage(`当前尺寸：${size}。移动端触控高度至少 44px。`)
                }
              >
                {size} · {size === "sm" ? "32" : size === "md" ? "36" : "44"}
              </Button>
            ))}
            <Button disabled>禁用</Button>
          </div>
        </div>
        <p role="status" className="min-h-5 text-caption text-fg-muted">
          {message}
        </p>
      </div>

      <div className="flex flex-col gap-4 border-t border-border pt-8">
        <h3 className="text-h3 font-semibold">Input</h3>
        <div className="preview-stage">
          <div className="grid w-full gap-6 sm:grid-cols-3">
            <Input
              id="sample-name"
              label="项目名称"
              placeholder="例如：landing-test"
              helpText="只能包含小写字母和连字符"
            />
            <Input
              id="sample-email"
              label="邮箱"
              type="email"
              defaultValue="name@"
              error="请输入完整的邮箱地址"
            />
            <Input
              id="sample-id"
              label="项目 ID"
              defaultValue="prj_8f2a"
              disabled
              helpText="创建后不可修改"
            />
          </div>
        </div>
        <p className="text-caption text-fg-muted">
          标签、输入框、帮助文字保持 4px 间距。错误状态同时提供文字说明。
        </p>
      </div>

      <div className="flex flex-col gap-4 border-t border-border pt-8">
        <h3 className="text-h3 font-semibold">Card</h3>
        <div className="preview-stage items-stretch">
          <Card className="min-w-0 flex-1 basis-64">
            <h4 className="text-h3 font-semibold">开始你的项目</h4>
            <p className="mt-1 text-fg-muted">
              输入一个项目名称，体验表单校验和操作反馈。
            </p>
            <form
              className="mt-6 flex flex-col gap-6"
              noValidate
              onSubmit={(event) => {
                event.preventDefault();
                setFormMessage("");
                if (!/^[a-z]+(?:-[a-z]+)*$/.test(name)) {
                  setError("请输入小写字母，单词之间用一个连字符连接");
                  return;
                }
                setError("");
                setFormMessage(
                  `已保存示例项目「${name}」。数据仅用于本页演示。`,
                );
              }}
            >
              <Input
                id="project-name"
                label="项目名称"
                placeholder="my-website"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  setError("");
                  setFormMessage("");
                }}
                error={error}
                helpText="例如：my-website"
                required
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setName("");
                    setError("");
                    setFormMessage("表单已重置。");
                  }}
                >
                  重置
                </Button>
                <Button type="submit">保存示例</Button>
              </div>
              <p role="status" className="text-caption text-fg-muted">
                {formMessage}
              </p>
            </form>
          </Card>
          <Card raised className="min-w-0 flex-1 basis-64">
            <Badge variant="primary">设计规范</Badge>
            <h4 className="mt-4 text-h3 font-semibold">清晰的层级</h4>
            <p className="mt-1 text-fg-muted">
              默认卡片使用 surface，浮层使用 surface-raised
              和阴影。深色模式用更亮的表面表达层级。
            </p>
            <div className="mt-6 border-t border-border pt-4 text-caption text-fg-subtle">
              12px 圆角 · 16px 内边距 · 1px 描边
            </div>
          </Card>
        </div>
      </div>

      <div className="flex flex-col gap-4 border-t border-border pt-8">
        <h3 className="text-h3 font-semibold">Badge</h3>
        <div className="preview-stage">
          <Badge>草稿</Badge>
          <Badge variant="primary">新功能</Badge>
          <Badge status="success">运行中</Badge>
          <Badge status="warning">即将到期</Badge>
          <Badge status="danger">构建失败</Badge>
        </div>
        <p className="text-caption text-fg-muted">
          状态使用中性文字和彩色圆点，信息不只依赖颜色。Badge 不承担点击操作。
        </p>
      </div>
    </div>
  );
}
