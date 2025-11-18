"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./SimpleEditor.module.css";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
  FaListUl,
  FaListOl,
  FaLink,
  FaUnlink,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaAlignJustify,
  FaCode,
  FaQuoteRight,
  FaImage,
  FaTable,
  FaUndo,
  FaRedo,
  FaFont,
  FaPalette,
  FaHighlighter,
  FaIndent,
  FaOutdent,
  FaSubscript,
  FaSuperscript,
  FaRemoveFormat,
} from "react-icons/fa";

export default function SimpleEditor({ value = "", onChange }) {
  const editorRef = useRef(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [currentFontSize, setCurrentFontSize] = useState("14");
  const [currentFontFamily, setCurrentFontFamily] = useState("Arial");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imgWidth, setImgWidth] = useState("");
  const [imgUnit, setImgUnit] = useState("px");
  const [imgBorderRadius, setImgBorderRadius] = useState("0");
  const [imgShadow, setImgShadow] = useState(false);
  const [imgBorder, setImgBorder] = useState(false);
  const [imgAlign, setImgAlign] = useState("none");

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value;
      setIsEditorReady(true);
    }
  }, []);

  useEffect(() => {
    if (isEditorReady && editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, [value, isEditorReady]);

  // إغلاق منتقي الألوان عند النقر خارجه
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.color-picker-container')) {
        setShowColorPicker(false);
        setShowBgColorPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInput = () => {
    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command, value = null) => {
    try {
      document.execCommand(command, false, value);
      editorRef.current?.focus();
      handleInput();
    } catch (error) {
    }
  };

  const insertLink = () => {
    const selection = window.getSelection();
    const selectedText = selection.toString();
    const url = prompt("أدخل الرابط:", "https://");
    if (url && url !== "https://") {
      if (selectedText) {
        execCommand("createLink", url);
      } else {
        const linkText = prompt("أدخل نص الرابط:", url);
        if (linkText) {
          const linkHtml = `<a href="${url}" target="_blank">${linkText}</a>`;
          execCommand("insertHTML", linkHtml);
        }
      }
    }
  };

  const insertImage = () => {
    const url = prompt("أدخل رابط الصورة:", "https://");
    if (url && url !== "https://") {
      const alt = prompt("أدخل وصف الصورة (اختياري):", "");
      const imageHtml = `<img src="${url}" alt="${alt}" style="max-width: 100%; height: auto; margin: 10px 0; display: block;" />`;
      execCommand("insertHTML", imageHtml);
    }
  };

  const insertTable = () => {
    const rows = prompt("عدد الصفوف:", "3");
    const cols = prompt("عدد الأعمدة:", "3");
    if (rows && cols && parseInt(rows) > 0 && parseInt(cols) > 0) {
      let tableHtml = '<table border="1" style="border-collapse: collapse; width: 100%; margin: 10px 0;">';
      for (let i = 0; i < parseInt(rows); i++) {
        tableHtml += "<tr>";
        for (let j = 0; j < parseInt(cols); j++) {
          tableHtml += '<td style="padding: 8px; border: 1px solid #ddd;">&nbsp;</td>';
        }
        tableHtml += "</tr>";
      }
      tableHtml += "</table>";
      execCommand("insertHTML", tableHtml);
    }
  };

  const formatBlock = (tag) => {
    execCommand("formatBlock", tag);
  };

  const changeFontSize = (size) => {
    setCurrentFontSize(size);
    try {
      document.execCommand("styleWithCSS", false, true);
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const span = document.createElement("span");
        span.style.fontSize = `${size}px`;
        if (range.collapsed) {
          span.innerHTML = '\u200B'; 
          range.insertNode(span);
          const newRange = document.createRange();
          newRange.setStartAfter(span);
          newRange.collapse(true);
          selection.removeAllRanges();
          selection.addRange(newRange);
        } else {
          span.appendChild(range.extractContents());
          range.insertNode(span);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
    } catch (e) {
    }
    handleInput();
  };

  const changeFontFamily = (font) => {
    setCurrentFontFamily(font);
    execCommand("fontName", font);
  };

  const changeTextColor = (color) => {
    execCommand("foreColor", color);
    setShowColorPicker(false);
  };

  const changeBackgroundColor = (color) => {
    execCommand("backColor", color);
    setShowBgColorPicker(false);
  };

  const toolbarButtons = [
    {
      icon: FaBold,
      command: "bold",
      title: "عريض (Ctrl+B)",
      shortcut: "Ctrl+B",
    },
    {
      icon: FaItalic,
      command: "italic",
      title: "مائل (Ctrl+I)",
      shortcut: "Ctrl+I",
    },
    {
      icon: FaUnderline,
      command: "underline",
      title: "تحته خط (Ctrl+U)",
      shortcut: "Ctrl+U",
    },
    {
      icon: FaStrikethrough,
      command: "strikeThrough",
      title: "يتوسطه خط",
    },
    {
      icon: FaSubscript,
      command: "subscript",
      title: "منخفض",
    },
    {
      icon: FaSuperscript,
      command: "superscript",
      title: "مرتفع",
    },
  ];

  const alignmentButtons = [
    {
      icon: FaAlignRight,
      command: "justifyRight",
      title: "محاذاة يمين",
    },
    {
      icon: FaAlignCenter,
      command: "justifyCenter",
      title: "محاذاة وسط",
    },
    {
      icon: FaAlignLeft,
      command: "justifyLeft",
      title: "محاذاة يسار",
    },
    {
      icon: FaAlignJustify,
      command: "justifyFull",
      title: "ضبط",
    },
  ];

  const listButtons = [
    {
      icon: FaListUl,
      command: "insertUnorderedList",
      title: "قائمة نقطية",
    },
    {
      icon: FaListOl,
      command: "insertOrderedList",
      title: "قائمة مرقمة",
    },
    {
      icon: FaIndent,
      command: "indent",
      title: "زيادة المسافة البادئة",
    },
    {
      icon: FaOutdent,
      command: "outdent",
      title: "تقليل المسافة البادئة",
    },
  ];

  const formatOptions = [
    { value: "div", label: "عادي" },
    { value: "h1", label: "عنوان 1" },
    { value: "h2", label: "عنوان 2" },
    { value: "h3", label: "عنوان 3" },
    { value: "h4", label: "عنوان 4" },
    { value: "h5", label: "عنوان 5" },
    { value: "h6", label: "عنوان 6" },
    { value: "p", label: "فقرة" },
    { value: "blockquote", label: "اقتباس" },
    { value: "pre", label: "كود" },
  ];

  const fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];

  const fontFamilies = [
    "Arial",
    "Helvetica",
    "Times New Roman",
    "Courier New",
    "Verdana",
    "Georgia",
    "Palatino",
    "Garamond",
    "Bookman",
    "Comic Sans MS",
    "Trebuchet MS",
    "Arial Black",
    "Impact",
    "Tahoma",
    "Cairo",
    "Amiri",
    "Noto Sans Arabic",
  ];

  const predefinedColors = [
    "#000000", "#333333", "#666666", "#999999", "#CCCCCC", "#FFFFFF",
    "#FF0000", "#FF6600", "#FFCC00", "#FFFF00", "#CCFF00", "#66FF00",
    "#00FF00", "#00FF66", "#00FFCC", "#00FFFF", "#00CCFF", "#0066FF",
    "#0000FF", "#6600FF", "#CC00FF", "#FF00FF", "#FF00CC", "#FF0066",
    "#800000", "#804000", "#808000", "#408000", "#008000", "#008040",
    "#008080", "#004080", "#000080", "#400080", "#800080", "#800040",
  ];

  const handleKeyDown = (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          execCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          execCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          execCommand('underline');
          break;
        case 'z':
          e.preventDefault();
          execCommand('undo');
          break;
        case 'y':
          e.preventDefault();
          execCommand('redo');
          break;
        case 'k':
          e.preventDefault();
          insertLink();
          break;
      }
    }
  };

  // Image selection and style handling
  const parseNumberAndUnit = (value, fallbackUnit = "px") => {
    if (!value) return ["", fallbackUnit];
    const match = String(value).match(/^(\d+(?:\.\d+)?)(px|%|rem|em)?$/);
    if (match) return [match[1], match[2] || fallbackUnit];
    return ["", fallbackUnit];
  };

  const selectImage = (img) => {
    setSelectedImage(img);
    const [wNum, wUnit] = parseNumberAndUnit(img.style.width || "");
    setImgWidth(wNum);
    setImgUnit(wUnit);
    setImgBorderRadius((img.style.borderRadius || "0").replace(/%|px/g, ""));
    setImgShadow(!!img.style.boxShadow);
    setImgBorder(!!img.style.border);
    if (img.style.float === "left") setImgAlign("left");
    else if (img.style.float === "right") setImgAlign("right");
    else if (img.style.display === "block" && img.style.marginLeft === "auto" && img.style.marginRight === "auto") setImgAlign("center");
    else setImgAlign("none");
  };

  const clearSelectedImage = () => {
    setSelectedImage(null);
  };

  const applyImageStyles = (updates = {}) => {
    if (!selectedImage) return;
    const img = selectedImage;
    if (updates.width !== undefined) {
      img.style.width = updates.width;
      img.style.height = "auto";
    }
    if (updates.borderRadius !== undefined) {
      img.style.borderRadius = updates.borderRadius;
    }
    if (updates.shadow !== undefined) {
      img.style.boxShadow = updates.shadow ? "0 4px 12px rgba(0,0,0,0.15)" : "";
    }
    if (updates.border !== undefined) {
      img.style.border = updates.border ? "1px solid #d1d5db" : "";
    }
    if (updates.align !== undefined) {
      const align = updates.align;
      img.style.float = "";
      if (align === "left") {
        img.style.float = "left";
        img.style.display = "inline";
        img.style.margin = "0 1rem 1rem 0";
      } else if (align === "right") {
        img.style.float = "right";
        img.style.display = "inline";
        img.style.margin = "0 0 1rem 1rem";
      } else if (align === "center") {
        img.style.float = "";
        img.style.display = "block";
        img.style.marginLeft = "auto";
        img.style.marginRight = "auto";
        img.style.marginTop = "10px";
        img.style.marginBottom = "10px";
      } else {
        img.style.float = "";
        img.style.display = "inline";
        img.style.margin = "10px 0";
      }
    }
    handleInput();
  };

  const handleEditorClick = (e) => {
    const target = e.target;
    if (target && target.tagName === "IMG") {
      selectImage(target);
    } else if (!e.target.closest('#image-controls-panel')) {
      clearSelectedImage();
    }
  };

  return (
    <div className={styles.editorContainer}>
      {/* شريط الأدوات */}
      <div className={styles.toolbar}>
        {/* الصف الأول - التنسيق الأساسي */}
        <div className="flex flex-wrap items-center gap-1 mb-2">
          {/* قائمة التنسيق */}
          <select
            onChange={(e) => formatBlock(e.target.value)}
            className={styles.toolbarSelect}
            defaultValue=""
          >
            <option value="" disabled>تنسيق</option>
            {formatOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* حجم الخط */}
          <select
            value={currentFontSize}
            onChange={(e) => changeFontSize(e.target.value)}
            className={styles.toolbarSelect}
          >
            {fontSizes.map((size) => (
              <option key={size} value={size}>{size}px</option>
            ))}
          </select>

          {/* نوع الخط */}
          <select
            value={currentFontFamily}
            onChange={(e) => changeFontFamily(e.target.value)}
            className={styles.toolbarSelect}
            style={{ minWidth: "120px" }}
          >
            {fontFamilies.map((font) => (
              <option key={font} value={font} style={{ fontFamily: font }}>
                {font}
              </option>
            ))}
          </select>

          <div className={styles.divider} />

          {/* أزرار التنسيق الأساسي */}
          {toolbarButtons.map((button, index) => {
            const Icon = button.icon;
            return (
              <button
                key={index}
                type="button"
                onClick={button.action || (() => execCommand(button.command))}
                className={styles.toolbarButton}
                title={button.title}
              >
                <Icon size={14} />
              </button>
            );
          })}

          <div className={styles.divider} />

          {/* منتقي الألوان */}
          <div className="relative color-picker-container">
            <button
              type="button"
              onClick={() => setShowColorPicker(!showColorPicker)}
              className={styles.toolbarButton}
              title="لون النص"
            >
              <FaFont size={14} />
            </button>
            {showColorPicker && (
              <div className="absolute top-full left-0 mt-1 p-2 bg-white border border-gray-300 rounded shadow-lg z-10 color-picker-container">
                <div className="grid grid-cols-6 gap-1 mb-2">
                  {predefinedColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => changeTextColor(color)}
                      className="w-6 h-6 border border-gray-300 rounded hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  onChange={(e) => changeTextColor(e.target.value)}
                  className="w-full h-8 border border-gray-300 rounded"
                  title="اختر لون مخصص"
                />
              </div>
            )}
          </div>

          {/* منتقي لون الخلفية */}
          <div className="relative color-picker-container">
            <button
              type="button"
              onClick={() => setShowBgColorPicker(!showBgColorPicker)}
              className={styles.toolbarButton}
              title="لون الخلفية"
            >
              <FaHighlighter size={14} />
            </button>
            {showBgColorPicker && (
              <div className="absolute top-full left-0 mt-1 p-2 bg-white border border-gray-300 rounded shadow-lg z-10 color-picker-container">
                <div className="grid grid-cols-6 gap-1 mb-2">
                  {predefinedColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => changeBackgroundColor(color)}
                      className="w-6 h-6 border border-gray-300 rounded hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  onChange={(e) => changeBackgroundColor(e.target.value)}
                  className="w-full h-8 border border-gray-300 rounded"
                  title="اختر لون خلفية مخصص"
                />
              </div>
            )}
          </div>
        </div>

        {/* الصف الثاني - المحاذاة والقوائم */}
        <div className="flex flex-wrap items-center gap-1">
          {/* أزرار المحاذاة */}
          {alignmentButtons.map((button, index) => {
            const Icon = button.icon;
            return (
              <button
                key={index}
                type="button"
                onClick={() => execCommand(button.command)}
                className={styles.toolbarButton}
                title={button.title}
              >
                <Icon size={14} />
              </button>
            );
          })}

          <div className={styles.divider} />

          {/* أزرار القوائم والمسافة البادئة */}
          {listButtons.map((button, index) => {
            const Icon = button.icon;
            return (
              <button
                key={index}
                type="button"
                onClick={() => execCommand(button.command)}
                className={styles.toolbarButton}
                title={button.title}
              >
                <Icon size={14} />
              </button>
            );
          })}

          <div className={styles.divider} />

          {/* أزرار الروابط والوسائط */}
          <button
            type="button"
            onClick={insertLink}
            className={styles.toolbarButton}
            title="إدراج رابط"
          >
            <FaLink size={14} />
          </button>

          <button
            type="button"
            onClick={() => execCommand("unlink")}
            className={styles.toolbarButton}
            title="إزالة الرابط"
          >
            <FaUnlink size={14} />
          </button>

          <button
            type="button"
            onClick={insertImage}
            className={styles.toolbarButton}
            title="إدراج صورة"
          >
            <FaImage size={14} />
          </button>

          <button
            type="button"
            onClick={insertTable}
            className={styles.toolbarButton}
            title="إدراج جدول"
          >
            <FaTable size={14} />
          </button>

          <div className={styles.divider} />

          {/* أزرار إضافية */}
          <button
            type="button"
            onClick={() => formatBlock("blockquote")}
            className={styles.toolbarButton}
            title="اقتباس"
          >
            <FaQuoteRight size={14} />
          </button>

          <button
            type="button"
            onClick={() => formatBlock("pre")}
            className={styles.toolbarButton}
            title="كود"
          >
            <FaCode size={14} />
          </button>

          <button
            type="button"
            onClick={() => execCommand("removeFormat")}
            className={styles.toolbarButton}
            title="إزالة التنسيق"
          >
            <FaRemoveFormat size={14} />
          </button>

          <div className={styles.divider} />

          {/* أزرار التراجع والإعادة */}
          <button
            type="button"
            onClick={() => execCommand("undo")}
            className={styles.toolbarButton}
            title="تراجع (Ctrl+Z)"
          >
            <FaUndo size={14} />
          </button>

          <button
            type="button"
            onClick={() => execCommand("redo")}
            className={styles.toolbarButton}
            title="إعادة (Ctrl+Y)"
          >
            <FaRedo size={14} />
          </button>
        </div>

        {/* لوحة تحكم الصورة */}
        {selectedImage && (
          <div id="image-controls-panel" className="mt-3 p-3 border border-gray-200 rounded-md bg-white shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-600">العرض</label>
                <input
                  type="number"
                  min="1"
                  max="2000"
                  value={imgWidth}
                  onChange={(e) => {
                    setImgWidth(e.target.value);
                    const widthStr = e.target.value ? `${e.target.value}${imgUnit}` : "";
                    applyImageStyles({ width: widthStr });
                  }}
                  className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
                />
                <select
                  value={imgUnit}
                  onChange={(e) => {
                    setImgUnit(e.target.value);
                    const widthStr = imgWidth ? `${imgWidth}${e.target.value}` : "";
                    applyImageStyles({ width: widthStr });
                  }}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  <option value="px">px</option>
                  <option value="%">%</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-600">الزوايا</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={imgBorderRadius}
                  onChange={(e) => {
                    setImgBorderRadius(e.target.value);
                    const val = e.target.value;
                    const unit = val && Number(val) <= 50 ? "%" : "px";
                    applyImageStyles({ borderRadius: val ? `${val}${unit}` : "0" });
                  }}
                  className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-600">المحاذاة</label>
                <select
                  value={imgAlign}
                  onChange={(e) => {
                    setImgAlign(e.target.value);
                    applyImageStyles({ align: e.target.value });
                  }}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  <option value="none">عادي</option>
                  <option value="left">يسار</option>
                  <option value="center">وسط</option>
                  <option value="right">يمين</option>
                </select>
              </div>

              <label className="inline-flex items-center gap-2 text-xs text-gray-700">
                <input
                  type="checkbox"
                  checked={imgShadow}
                  onChange={(e) => {
                    setImgShadow(e.target.checked);
                    applyImageStyles({ shadow: e.target.checked });
                  }}
                />
                ظل
              </label>

              <label className="inline-flex items-center gap-2 text-xs text-gray-700">
                <input
                  type="checkbox"
                  checked={imgBorder}
                  onChange={(e) => {
                    setImgBorder(e.target.checked);
                    applyImageStyles({ border: e.target.checked });
                  }}
                />
                إطار
              </label>

              <button
                type="button"
                onClick={clearSelectedImage}
                className="ml-auto px-2 py-1 text-xs rounded border border-gray-300 hover:bg-gray-50"
              >
                إغلاق التحكم
              </button>
            </div>
          </div>
        )}
      </div>

      {/* منطقة التحرير */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        onKeyDown={handleKeyDown}
        onClick={handleEditorClick}
        className={styles.editorContent}
        style={{
          direction: "rtl",
          textAlign: "right",
          fontFamily: currentFontFamily,
          fontSize: currentFontSize + "px",
        }}
        placeholder="ابدأ الكتابة هنا..."
        suppressContentEditableWarning={true}
      />

      {/* نصائح الاستخدام */}
      <div className={styles.shortcuts}>
        <div className={styles.shortcutsList}>
          <span>Ctrl+B: عريض</span>
          <span>Ctrl+I: مائل</span>
          <span>Ctrl+U: تحته خط</span>
          <span>Ctrl+K: رابط</span>
          <span>Ctrl+Z: تراجع</span>
          <span>Ctrl+Y: إعادة</span>
        </div>
      </div>
    </div>
  );
}