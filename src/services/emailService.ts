import { Order } from '../types';
import { WEB3FORMS_ACCESS_KEY, BRAND_INFO } from '../config/authConfig';

export const sendOrderEmailNotification = async (order: Order): Promise<boolean> => {
  try {
    const itemsList = order.items
      .map(
        (item, idx) =>
          `${idx + 1}. ${item.saree.name}\n   • Category: ${item.saree.category} | Fabric: ${item.saree.fabric} | Color: ${item.saree.color}\n   • Quantity: ${item.quantity}\n   • Price: ₹${item.saree.price.toLocaleString('en-IN')}${item.saree.vendorName ? ` (Supplier: ${item.saree.vendorName})` : ''}`
      )
      .join('\n\n');

    const formattedMessage = `
=====================================================
🎉 NEW CUSTOMER ORDER RECEIVED - ${BRAND_INFO.name.toUpperCase()}
=====================================================

📋 ORDER DETAILS:
-----------------------------------------------------
• Order ID: ${order.id}
• Placed At: ${new Date(order.orderedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
• Estimated Delivery: ${order.expectedDelivery}
• Status: ${order.status}
• Total Order Value: ₹${order.total.toLocaleString('en-IN')}

👤 CUSTOMER INFORMATION:
-----------------------------------------------------
• Name: ${order.customer.name}
• Phone: ${order.customer.phone}
• Email: ${order.customer.email}
• Shipping Address: ${order.customer.address}
• City & State: ${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}

🛍️ ITEMS ORDERED (${order.items.reduce((sum, i) => sum + i.quantity, 0)} items):
-----------------------------------------------------
${itemsList}

💰 BILLING BREAKDOWN:
-----------------------------------------------------
• Subtotal: ₹${order.subtotal.toLocaleString('en-IN')}
• Shipping: FREE (Complimentary)
• Final Total: ₹${order.total.toLocaleString('en-IN')}

-----------------------------------------------------
👉 Action Required: Login to the Admin Portal to confirm and process this order.
`;

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: `🛍️ New Order Received #${order.id} - ₹${order.total.toLocaleString('en-IN')} from ${order.customer.name}`,
        from_name: `${BRAND_INFO.name} Store Orders`,
        email: order.customer.email,
        name: order.customer.name,
        phone: order.customer.phone,
        message: formattedMessage
      })
    });

    const result = await response.json();
    if (result.success) {
      console.log('Order notification email sent successfully via Web3Forms');
      return true;
    } else {
      console.warn('Web3Forms returned non-success for order email:', result);
      return false;
    }
  } catch (error) {
    console.error('Failed to send order notification email:', error);
    return false;
  }
};
