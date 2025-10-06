function stripHtml(html) {
    // loại bỏ toàn bộ thẻ html + xuống dòng + khoảng trắng thừa
    return html
        .replace(/<[^>]*>/g, ' ') // bỏ thẻ
        .replace(/\s+/g, ' ') // bỏ khoảng trắng thừa
        .trim();
}

function generateMetaDescription(content, metaDescription) {
    // Nếu client truyền metaDescription -> dùng luôn
    if (metaDescription && metaDescription.trim() !== '') return metaDescription.trim();

    // Nếu không có -> lấy text từ content đã strip HTML
    if (content && content.trim() !== '') {
        const text = stripHtml(content);
        return text.substring(0, 160); // lấy 160 ký tự đầu
    }

    return '';
}
