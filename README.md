Markdown
# 🛒 Ecommerce 全端電商系統

一個基於 **Spring Boot** 後端架構與 **Vite** 前端現代化開發工具所構建的電商 side project。本專案採用前後端分離的架構進行開發，並整合於單一儲存庫（Mono-repo）中，便於版本管理與本地開發測試。

---

## 🏗️ 專案架構與目錄說明

本專案主要分為前端與後端兩個核心模組：

```text
Ecommerce/
├── backend/        # 後端 Java / Spring Boot 專案
│   ├── src/        # 核心商業邏輯、Controller、Service、Repository
│   └── pom.xml     # Maven 依賴管理控制
├── frontend/       # 前端 Vite / 現代化前端專案
│   ├── src/        # 前端頁面、元件、狀態管理與 API 請求
│   └── package.json# Node.js 依賴與腳本設定
└── README.md       # 本專案說明文件
🛠️ 技術棧 (Tech Stack)
後端技術 (Backend)
核心框架: Java / Spring Boot

安全驗證: Spring Security / JWT (依實際情況調整)

資料庫互動: Spring Data JPA / Hibernate

依賴與建置工具: Maven

前端技術 (Frontend)
建置工具: Vite

核心環境: Node.js / JavaScript

網路請求: Axios (用於呼叫 Spring Boot RESTful APIs)

⚡ 快速啟動與本地運行 (How to Run)
在開始之前，請確保您的環境已安裝 Java 17+、Maven 以及 Node.js。

1. 後端啟動 (Backend)
使用 IntelliJ IDEA 打開 backend 資料夾。

等待 Maven 載入完所有依賴項目（pom.xml）。

檢查 backend/src/main/resources/application.properties 的資料庫連線設定。

執行主程式 EcommerceApplication.java 啟動後端服務。

2. 前端啟動 (Frontend)
打開終端機並切換至 frontend 資料夾，依序執行以下指令：

Bash
cd frontend
npm install
npm run dev
啟動後，點擊終端機顯示的本地預覽網址（通常為 http://localhost:5173）即可進入系統畫面。

🎯 核心功能亮點 (Key Features)
RESTful API 設計: 後端嚴格遵循 RESTful 規範設計，提供乾淨、具語意性的 API 接口。

全端獨立開發能力: 前後端架構切分清晰，後端專注於資料處理與商業邏輯，前端專注於使用者體驗與畫面渲染。

環境隔離與安全維護: 透過 .gitignore 機制，確保本地敏感設定（如資料庫密碼）與肥大暫存檔（node_modules、target）不會流出。

✉️ 聯絡與作者資訊
GitHub: @sJun101