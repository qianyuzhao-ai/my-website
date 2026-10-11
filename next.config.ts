import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

// 文章以 MDX 模块的形式按需导入（src/content/posts），不作为页面路由。
const withMDX = createMDX();

export default withMDX(nextConfig);
