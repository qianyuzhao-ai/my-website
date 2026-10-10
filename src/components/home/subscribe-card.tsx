"use client";

import { type FormEvent, useState } from "react";
import { BentoCard } from "@/components/home/bento-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 仅本地校验：订阅服务尚未接入，不保存或发送数据。
export function SubscribeCard() {
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email") ?? "")
      .trim()
      .toLowerCase();

    if (!email) {
      setError("请输入邮箱地址");
      setStatus("");
    } else if (!emailPattern.test(email)) {
      setError("邮箱格式不正确，例如 name@example.com");
      setStatus("");
    } else {
      setError("");
      setStatus("已收到，订阅功能上线后会通知你。");
    }
  }

  return (
    <BentoCard className="bg-surface p-6 lg:px-10 lg:pt-9">
      <form
        noValidate
        onSubmit={handleSubmit}
        className="flex flex-col gap-2.5"
      >
        <h2 className="font-serif text-title font-bold">
          Shall I keep you in the loop?
        </h2>
        <p>
          Content includes articles, early access to products, and ongoing
          learnings.
        </p>
        <Input
          id="subscribe-email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          label="Email address"
          placeholder="Email address"
          hideLabel
          error={error}
          onChange={() => error && setError("")}
        />
        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Button type="submit" variant="ghost" size="sm" className="-ml-3">
            Subscribe
          </Button>
          <p className="text-caption text-fg-muted">
            You’ll be subscriber number 170
          </p>
        </div>
        <p aria-live="polite" className="text-caption text-accent empty:hidden">
          {status}
        </p>
      </form>
    </BentoCard>
  );
}
