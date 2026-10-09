import { Order } from '../types';
import { WEB3FORMS_ACCESS_KEY, BRAND_INFO } from '../config/authConfig';

export const sendOrderEmailNotification = async (order: Order): Promise<boolean> => {
  try {
    const itemsFormatted = order.items
      .map(
        (item, idx) =>
          `${idx + 1}. ${item.saree.name} | Qty: ${item.quantity} | Price: ₹${item.saree.price.toLocaleString('en-IN')}${item.saree.vendorName ? ` (Vendor: ${item.saree.vendorName})` : ''}`
      )
      .join('\n');

    const fullAddress = `${order.customer.address}, ${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}`;

    const messageText = `
🎉 NEW CUSTOMER ORDER RECEIVED!
--------------------------------------------------
• Order ID: ${order.id}
• Total Amount: ₹${order.total.toLocaleString('en-IN')}
• Placed At: ${new Date(order.orderedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
• Status: ${order.status}

👤 CUSTOMER DETAILS:
• Name: ${order.customer.name}
• Phone: ${order.customer.phone}
• Email: ${order.customer.email}
• Shipping Address: ${fullAddress}

🛍️ ITEMS ORDERED:
${itemsFormatted}

💰 FINANCIAL SUMMARY:
• Subtotal: ₹${order.subtotal.toLocaleString('en-IN')}
• Delivery: FREE (7-Day Fast Delivery)
• Total Paid/Due: ₹${order.total.toLocaleString('en-IN')}
--------------------------------------------------
Action: Login to /admin to confirm this order.
`;

    const payload = {
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: `🛍️ New Order #${order.id} - ₹${order.total.toLocaleString('en-IN')} (${order.customer.name})`,
      from_name: `${BRAND_INFO.name} Saree Orders`,
      name: order.customer.name,
      email: order.customer.email,
      phone: order.customer.phone,
      order_id: order.id,
      order_total: `₹${order.total.toLocaleString('en-IN')}`,
      delivery_address: fullAddress,
      items: itemsFormatted,
      message: messageText
    };

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    if (result.success) {
      console.log('Order notification email submitted successfully via Web3Forms');
      return true;
    } else {
      console.warn('Web3Forms response:', result);
      return false;
    }
  } catch (error) {
    console.error('Failed to dispatch order email:', error);
    return false;
  }
};
