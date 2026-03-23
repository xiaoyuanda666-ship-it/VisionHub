/**
 * 更新实时显示网页的工具
 * AI Agent 可以使用此工具在网页上显示信息
 */
export async function update_display(args, context) {
  const { type, title, content, data } = args || {};

  const serverUrl = process.env.REALTIME_DISPLAY_URL || 'http://localhost:3001';

  try {
    const response = await fetch(`${serverUrl}/api/update-display`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: type || 'info',
        title: title,
        content: content,
        data: data
      })
    });

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP error: ${response.status}`
      };
    }

    const result = await response.json();
    return {
      success: true,
      message: 'Display updated successfully',
      displayData: result.displayData
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * 清空实时显示网页的工具
 */
export async function clear_display(args, context) {
  const serverUrl = process.env.REALTIME_DISPLAY_URL || 'http://localhost:3001';

  try {
    const response = await fetch(`${serverUrl}/api/clear-display`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP error: ${response.status}`
      };
    }

    const result = await response.json();
    return {
      success: true,
      message: 'Display cleared successfully',
      displayData: result.displayData
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}
