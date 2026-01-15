"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import Editor from "@monaco-editor/react"

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language?: string
  height?: string
  readOnly?: boolean
  className?: string
}

export function CodeEditor({
  value,
  onChange,
  language = "python",
  height = "400px",
  readOnly = false,
  className = "",
}: CodeEditorProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleEditorChange = (value: string | undefined) => {
    onChange(value || "")
  }

  if (!mounted) {
    return (
      <div className={`border rounded-lg overflow-hidden ${className}`} style={{ height }}>
        <div className="flex items-center justify-center h-full bg-zinc-900">
          <p className="text-zinc-400">Loading editor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`border-0 overflow-hidden ${className}`} style={{ height, width: '100%' }}>
      <Editor
        height={height}
        defaultLanguage={language}
        language={language}
        value={value}
        onChange={handleEditorChange}
        theme={theme === "dark" ? "vs-dark" : "vs-dark"}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 4,
          readOnly: readOnly,
          wordWrap: "on",
          folding: true,
          lineDecorationsWidth: 10,
          lineNumbersMinChars: 3,
          padding: { top: 16, bottom: 16 },
          renderLineHighlight: "all",
          scrollbar: {
            vertical: "visible",
            horizontal: "visible",
            useShadows: false,
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
          },
        }}
        loading={
          <div className="flex items-center justify-center h-full bg-zinc-900">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500"></div>
              <p className="text-zinc-400 text-sm">Loading editor...</p>
            </div>
          </div>
        }
      />
    </div>
  )
}
