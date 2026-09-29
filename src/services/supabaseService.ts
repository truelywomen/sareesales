import { supabase } from '../lib/supabase';
import { Saree, Order, OrderStatusType } from '../types';
import { INITIAL_SAREES } from '../data/sampleSarees';

// Helper to map DB row to Saree model
const mapRowToSaree = (row: any): Saree => ({
  id: row.id,
  name: row.name,
  price: Number(row.price),
  originalPrice: row.original_price ? Number(row.original_price) : undefined,
  image: row.image,
  category: row.category,
  fabric: row.fabric,
  color: row.color,
  description: row.description,
  stock: row.stock ?? 1,
  badge: row.badge ?? undefined,
  createdAt: row.created_at || new Date().toISOString()
});

// Helper to map Saree to DB row
const mapSareeToRow = (saree: Saree) => ({
  id: saree.id,
  name: saree.name,
  price: saree.price,
  original_price: saree.originalPrice || null,
  image: saree.image,
  category: saree.category,
  fabric: saree.fabric,
  color: saree.color,
  description: saree.description,
  stock: saree.stock ?? 1,
  badge: saree.badge || null,
  created_at: saree.createdAt || new Date().toISOString()
});

// Helper to map DB row to Order model
const mapRowToOrder = (row: any): Order => ({
  id: row.id,
  customer: typeof row.customer === 'string' ? JSON.parse(row.customer) : row.customer,
  items: typeof row.items === 'string' ? JSON.parse(row.items) : row.items,
  subtotal: Number(row.subtotal),
  total: Number(row.total),
  orderedAt: row.ordered_at || row.created_at || new Date().toISOString(),
  expectedDelivery: row.expected_delivery || '',
  status: (row.status as OrderStatusType) || 'Order Placed'
});

// ==========================================
// SAREES API
// ==========================================

export const fetchSareesFromDb = async (): Promise<Saree[]> => {
  try {
    const { data, error } = await supabase
      .from('sarees')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch error, falling back:', error.message);
      return [];
    }

    if (!data || data.length === 0) {
      // Seed initial sample sarees to Supabase cloud
      console.log('Seeding initial sarees to Supabase...');
      const rowsToInsert = INITIAL_SAREES.map(mapSareeToRow);
      const { data: inserted, error: seedError } = await supabase
        .from('sarees')
        .insert(rowsToInsert)
        .select();

      if (!seedError && inserted) {
        return inserted.map(mapRowToSaree);
      }
      return INITIAL_SAREES;
    }

    return data.map(mapRowToSaree);
  } catch (err) {
    console.error('Error fetching sarees from Supabase:', err);
    return [];
  }
};

export const createSareeInDb = async (saree: Saree): Promise<Saree | null> => {
  try {
    const row = mapSareeToRow(saree);
    const { data, error } = await supabase
      .from('sarees')
      .insert([row])
      .select()
      .single();

    if (error) {
      console.error('Error inserting saree into Supabase:', error.message);
      return null;
    }

    return mapRowToSaree(data);
  } catch (err) {
    console.error('Failed to create saree:', err);
    return null;
  }
};

export const updateSareeInDb = async (id: string, updates: Partial<Saree>): Promise<Saree | null> => {
  try {
    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.price !== undefined) dbUpdates.price = updates.price;
    if (updates.originalPrice !== undefined) dbUpdates.original_price = updates.originalPrice;
    if (updates.image !== undefined) dbUpdates.image = updates.image;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.fabric !== undefined) dbUpdates.fabric = updates.fabric;
    if (updates.color !== undefined) dbUpdates.color = updates.color;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.stock !== undefined) dbUpdates.stock = updates.stock;
    if (updates.badge !== undefined) dbUpdates.badge = updates.badge;

    const { data, error } = await supabase
      .from('sarees')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating saree in Supabase:', error.message);
      return null;
    }

    return mapRowToSaree(data);
  } catch (err) {
    console.error('Failed to update saree:', err);
    return null;
  }
};

export const deleteSareeFromDb = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('sarees')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting saree from Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to delete saree:', err);
    return false;
  }
};

// ==========================================
// ORDERS API
// ==========================================

export const fetchOrdersFromDb = async (): Promise<Order[]> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('ordered_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch orders error:', error.message);
      return [];
    }

    return (data || []).map(mapRowToOrder);
  } catch (err) {
    console.error('Error fetching orders from Supabase:', err);
    return [];
  }
};

export const createOrderInDb = async (order: Order): Promise<Order | null> => {
  try {
    const row = {
      id: order.id,
      customer: order.customer,
      items: order.items,
      subtotal: order.subtotal,
      total: order.total,
      ordered_at: order.orderedAt,
      expected_delivery: order.expectedDelivery,
      status: order.status
    };

    const { data, error } = await supabase
      .from('orders')
      .insert([row])
      .select()
      .single();

    if (error) {
      console.error('Error creating order in Supabase:', error.message);
      return null;
    }

    return mapRowToOrder(data);
  } catch (err) {
    console.error('Failed to create order:', err);
    return null;
  }
};

export const updateOrderStatusInDb = async (id: string, status: OrderStatusType): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating order status in Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to update order status:', err);
    return false;
  }
};
