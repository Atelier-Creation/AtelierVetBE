import { sequelize } from "../../../db/index.js";
import { Op } from "sequelize";
import LabTestOrders from "../models/labtestorders.models.js";
import LabTestOrderItems from "../models/labtestordersiteams.models.js";
import Client from "../../clients/models/clients.models.js";
import Encounter from "../../clinical/models/encounters.models.js";
import LabTestsMaster from "../models/labtestsmaster.models.js";
import User from "../../../user/models/user.model.js";
import "../models/index.js";

const labTestOrdersService = {
    /**
     * ✅ Create Lab Test Order with Items
     */
    async create(data, userInfo = {}) {
        const transaction = await sequelize.transaction();
        try {
            if (!data.encounter_id) throw new Error("encounter_id is required");

            if (!data.client_id) {
                const encounter = await Encounter.findByPk(data.encounter_id);
                if (!encounter) throw new Error("Encounter not found");
                data.client_id = encounter.client_id;
            }

            if (!data.priority) throw new Error("priority is required");
            if (!Array.isArray(data.items) || data.items.length === 0) {
                throw new Error("At least one lab test item is required");
            }

            const count = await LabTestOrders.count();
            const orderNo = `LTO-${String(count + 1).padStart(5, "0")}`;

            const order = await LabTestOrders.create(
                {
                    client_id: data.client_id,
                    encounter_id: data.encounter_id,
                    order_no: orderNo,
                    order_date: new Date(),
                    status: "pending",
                    priority: data.priority,
                    created_by: userInfo.id || null,
                    created_by_name: userInfo.name || null,
                    created_by_email: userInfo.email || null,
                },
                { transaction }
            );

            for (const item of data.items) {
                if (!item.lab_test_id) throw new Error("lab_test_id is required for each item");

                await LabTestOrderItems.create(
                    {
                        order_id: order.id,
                        lab_test_id: item.lab_test_id,
                        sample_type: item.sample_type || "Blood",
                        collected_at: item.collected_at || null,
                        result_value: item.result_value || null,
                        result_file_url: item.result_file_url || null,
                        resulted_by: null,
                        resulted_at: null,
                    },
                    { transaction }
                );
            }

            await transaction.commit();
            return {
                message: "Lab Test Order created successfully",
                order_id: order.id,
                order_no: order.order_no,
            };
        } catch (error) {
            await transaction.rollback();
            console.error("❌ Error creating lab test order:", error);
            throw new Error(error.message || "Failed to create lab test order");
        }
    },

    /**
     * ✅ Get All Lab Test Orders (with items & test details)
     */
    async getAll(options = {}) {
        const {
            page = 1,
            limit = 10,
            search = "",
            status,
            client_id,
            start_date,
            end_date,
            sort_by = "createdAt",
            sort_order = "DESC",
        } = options;

        const offset = (page - 1) * limit;
        const where = {};

        if (search) {
            where[Op.or] = [{ order_no: { [Op.like]: `%${search}%` } }];
        }

        if (status) where.status = status;
        if (client_id) where.client_id = client_id;
        if (start_date && end_date)
            where.order_date = { [Op.between]: [new Date(start_date), new Date(end_date)] };

        const { count, rows } = await LabTestOrders.findAndCountAll({
            where,
            offset,
            limit: Number(limit),
            order: [[sort_by, sort_order]],
            include: [
                { model: Client, as: "client" },
                { model: Encounter, as: "encounter" },
                {
                    model: LabTestOrderItems,
                    as: "items",
                    include: [{ model: LabTestsMaster, as: "test" }],
                },
            ],
        });

        return {
            total: count,
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            data: rows,
        };
    },

    /**
     * ✅ Get Lab Test Order by ID (with items)
     */
    async getById(id) {
        const order = await LabTestOrders.findByPk(id, {
            include: [
                { model: Client, as: "client" },
                { model: Encounter, as: "encounter" },
                {
                    model: LabTestOrderItems,
                    as: "items",
                    include: [{ model: LabTestsMaster, as: "test" }],
                },
            ],
        });

        if (!order) throw new Error("Lab test order not found");
        return order;
    },

    async getByEncounterId(id) {
        const order = await LabTestOrders.findOne({
            where: { encounter_id: id },
            include: [
                { model: Client, as: "client" },
                { model: Encounter, as: "encounter" },
                {
                    model: LabTestOrderItems,
                    as: "items",
                    include: [{ model: LabTestsMaster, as: "test" }],
                },
            ],
        });
        return order;
    },

    /**
     * ✅ Update Lab Test Order Status / Priority and sync items
     *
     * If `data.items` present:
     *  - items with `id` are updated
     *  - items without `id` are created
     *  - existing DB items not present in payload are removed
     */
    async update(id, data, userInfo = {}) {
        const order = await LabTestOrders.findByPk(id);
        if (!order) throw new Error("Lab test order not found");

        const transaction = await sequelize.transaction();
        try {
            const { items, ...orderPayload } = data;

            // Update order-level fields + audit
            await order.update(
                {
                    ...orderPayload,
                    updated_by: userInfo.id || null,
                    updated_by_name: userInfo.name || null,
                    updated_by_email: userInfo.email || null,
                },
                { transaction }
            );

            if (Array.isArray(items)) {
                // Fetch existing items for this order
                const existingItems = await LabTestOrderItems.findAll({
                    where: { order_id: id },
                    transaction,
                });

                const existingIds = existingItems.map((it) => it.id);
                const incomingIds = items.filter((it) => it.id).map((it) => it.id);

                // Delete items that exist in DB but not in incoming payload
                const toDelete = existingIds.filter((eid) => !incomingIds.includes(eid));
                if (toDelete.length) {
                    await LabTestOrderItems.destroy({
                        where: { id: toDelete },
                        transaction,
                    });
                }

                // Upsert incoming items
                for (const it of items) {
                    // Normalize payload for item
                    const itemPayload = {
                        lab_test_id: it.lab_test_id,
                        sample_type: it.sample_type ?? "Blood",
                        collected_at: it.collected_at ?? null,
                        result_value: it.result_value ?? null,
                        result_file_url: it.result_file_url ?? null,
                        resulted_by: it.resulted_by ?? null,
                        resulted_at: it.resulted_at ?? null,
                    };

                    if (it.id) {
                        // Update existing item
                        await LabTestOrderItems.update(itemPayload, {
                            where: { id: it.id },
                            transaction,
                        });
                    } else {
                        // Create new item and associate to order
                        await LabTestOrderItems.create(
                            {
                                ...itemPayload,
                                order_id: id,
                                created_by: userInfo.id || null,
                                created_by_name: userInfo.name || null,
                                created_by_email: userInfo.email || null,
                            },
                            { transaction }
                        );
                    }
                }
            }

            await transaction.commit();

            // Return updated order with items
            const updatedOrder = await LabTestOrders.findByPk(id, {
                include: [
                    { model: Client, as: "client" },
                    { model: Encounter, as: "encounter" },
                    {
                        model: LabTestOrderItems,
                        as: "items",
                        include: [{ model: LabTestsMaster, as: "test" }],
                    },
                ],
            });

            return updatedOrder;
        } catch (error) {
            await transaction.rollback();
            console.error("❌ Error updating lab test order:", error);
            throw new Error(error.message || "Failed to update lab test order");
        }
    },

    /**
     * ✅ Delete (Soft Delete) Lab Test Order
     */
    async delete(id, userInfo = {}) {
        const order = await LabTestOrders.findByPk(id);
        if (!order) throw new Error("Lab test order not found");

        await order.update({
            is_active: false,
            status: "cancelled",
            deleted_by: userInfo.id || null,
            deleted_by_name: userInfo.name || null,
            deleted_by_email: userInfo.email || null,
        });

        return { message: "Lab Test Order cancelled successfully" };
    },

    /**
     * ✅ Get All Lab Test Orders by Client ID
     */
    async getByClient(client_id) {
        if (!client_id) throw new Error("client_id is required");

        const orders = await LabTestOrders.findAll({
            where: { client_id },
            order: [["createdAt", "DESC"]],
            include: [
                { model: Encounter, as: "encounter" },
                {
                    model: LabTestOrderItems,
                    as: "items",
                    include: [{ model: LabTestsMaster, as: "test" }],
                },
            ],
        });

        return orders;
    },

    /**
     * ✅ Get All Pending Lab Test Orders
     */
    async getPending() {
        const orders = await LabTestOrders.findAll({
            where: { status: "pending" },
            order: [["createdAt", "DESC"]],
            include: [
                { model: Client, as: "client" },
                { model: Encounter, as: "encounter" },
                {
                    model: LabTestOrderItems,
                    as: "items",
                    include: [{ model: LabTestsMaster, as: "test" }],
                },
            ],
        });

        return orders;
    },

    /**
     * ✅ Mark a Lab Test Item as Resulted
     */
    async markResulted(item_id, data) {
        if (!item_id) throw new Error("item_id is required");

        const item = await LabTestOrderItems.findByPk(item_id);
        if (!item) throw new Error("Lab test item not found");

        await item.update({
            result_value: data.result_value || item.result_value,
            result_file_url: data.result_file_url || item.result_file_url,
            resulted_by: data.resulted_by || item.resulted_by,
            resulted_at: new Date(),
        });

        // Check if all items in the order are resulted
        const remaining = await LabTestOrderItems.count({
            where: {
                order_id: item.order_id,
                resulted_at: { [Op.is]: null },
            },
        });

        if (remaining === 0) {
            const order = await LabTestOrders.findByPk(item.order_id);
            if (order) await order.update({ status: "completed" });
        }

        return { message: "Lab test item marked as resulted successfully" };
    },
};

export default labTestOrdersService;
