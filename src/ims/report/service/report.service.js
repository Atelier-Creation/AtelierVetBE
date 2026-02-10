import { Op } from "sequelize";
import User from "../../user/models/user.model.js";
import ExcelJS from "exceljs";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import fs from "fs";
import path from "path";
import Role from "../../user/models/role.model.js";
import Billing from "../../billing/models/billing.models.js";
import BillingItem from "../../billing/models/billingiteam.models.js";
import Product from "../../product/models/product.model.js";

User.belongsTo(Role, { foreignKey: "role_id", as: "role" });



const reportService = {
  async getUserReport(options = {}) {
    const {
      page = 1,
      limit = 10,
      search,
      is_active,
      is_master,
      role_id,
      start_date,
      end_date,
      sort_by = "createdAt",
      sort_order = "DESC",
      download_type, // <-- new: 'pdf' or 'excel'
    } = options;

    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);
    const offset = (parsedPage - 1) * parsedLimit;

    // 🔍 Build dynamic filters
    const where = {};

    if (search) {
      where[Op.or] = [
        { username: { [Op.like]: `%${search}%` } }, // Use Op.iLike only in Postgres
        { email: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } },
      ];
    }

    if (is_active === "true") {
      where.is_active = true;
    } else if (is_active === "false") {
      where.is_active = false;
    }

    if (role_id) {
      where.role_id = role_id;
    }
    if (is_master !== undefined)
      where.is_master =
        typeof is_master === "string" ? is_master === "true" : is_master;

    if (start_date && end_date) {
      where.createdAt = {
        [Op.between]: [
          new Date(start_date),
          new Date(new Date(end_date).setHours(23, 59, 59, 999))
        ],
      };
    } else if (start_date) {
      where.createdAt = { [Op.gte]: new Date(start_date) };
    } else if (end_date) {
      where.createdAt = { [Op.lte]: new Date(new Date(end_date).setHours(23, 59, 59, 999)) };
    }


    // 🔹 Fetch data
    const { count, rows } = await User.findAndCountAll({
      where,
      order: [[sort_by, sort_order]],
      offset,
      include: [
        {
          model: Role,
          as: "role",
          attributes: ["id", "role_name"], // select only what you need
        },
      ],
      limit: parsedLimit,
      attributes: [
        "id",
        "username",
        "email",
        "phone",
        "role_id",
        "is_active",
        "created_by_name",
        "created_by_email",
        "createdAt",
        "updatedAt",
      ],
    });

    const totalPages = Math.ceil(count / parsedLimit);

    // ✅ If user wants to download PDF or Excel
    if (download_type) {
      const filePath = await this.generateDownloadFileuser(rows, download_type);
      return { success: true, filePath };
    }

    // ✅ Default paginated JSON response
    return {
      success: true,
      meta: {
        total_records: count,
        total_pages: totalPages,
        current_page: parsedPage,
        per_page: parsedLimit,
      },
      filters_applied: {
        search,
        is_active,
        is_master,
        role_id,
        start_date,
        end_date,
        sort_by,
        sort_order,
      },
      data: rows,
    };
  },

  // 📄 Generate PDF or Excel File
  async generateDownloadFileuser(rows, type) {
    const downloadsDir = path.resolve("downloads");
    if (!fs.existsSync(downloadsDir)) fs.mkdirSync(downloadsDir);

    if (type === "excel") {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("User Report");

      worksheet.columns = [
        { header: "Username", key: "username", width: 25 },
        { header: "Email", key: "email", width: 30 },
        { header: "Phone", key: "phone", width: 15 },
        { header: "Role", key: "role_name", width: 20 },
        { header: "Active", key: "is_active", width: 10 },
        { header: "Created By", key: "created_by_name", width: 20 },
        { header: "Created At", key: "createdAt", width: 25 },
      ];

      rows.forEach((user) => {
        worksheet.addRow({
          username: user.username,
          email: user.email,
          phone: user.phone,
          role_name: user.role ? user.role.role_name : "-",
          is_active: user.is_active ? "Yes" : "No",
          created_by_name: user.created_by_name || "-",
          createdAt: user.createdAt
            ? new Date(user.createdAt).toLocaleString()
            : "-",
        });
      });

      const filePath = path.join(downloadsDir, `User_Report_${Date.now()}.xlsx`);
      await workbook.xlsx.writeFile(filePath);
      return filePath;
    }

    if (type === "pdf") {
      const doc = new jsPDF();
      doc.text("User Report", 14, 15);

      const tableData = rows.map((user) => [
        user.username,
        user.email,
        user.phone,
        user.role ? user.role.role_name : "-",
        user.is_active ? "Active" : "Inactive",
        user.created_by_name || "-",
        new Date(user.createdAt).toLocaleString(),
      ]);

      autoTable(doc, {
        head: [
          ["Username", "Email", "Phone", "Role", "Active", "Created By", "Created At"],
        ],
        body: tableData,
        startY: 20,
      });

      const filePath = path.join(downloadsDir, `User_Report_${Date.now()}.pdf`);
      doc.save(filePath);
      return filePath;
    }

    throw new Error("Invalid download type");
  },

  async getBillingReport(options = {}) {
    const {
      page = 1,
      limit = 10,
      search,
      start_date,
      end_date,
      status,
      payment_method,
      download_type, // 'pdf' | 'excel'
      sort_by = "createdAt",
      sort_order = "DESC",
    } = options;

    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);
    const offset = (parsedPage - 1) * parsedLimit;

    // 🔍 Build dynamic filters
    const where = {};

    if (search) {
      where[Op.or] = [
        { billing_no: { [Op.like]: `%${search}%` } },
        { customer_name: { [Op.like]: `%${search}%` } },
        { customer_phone: { [Op.like]: `%${search}%` } },
      ];
    }

    if (status) where.status = status;
    if (payment_method) where.payment_method = payment_method;

    if (start_date && end_date) {
      where.createdAt = {
        [Op.between]: [
          new Date(start_date),
          new Date(new Date(end_date).setHours(23, 59, 59, 999))
        ],
      };
    } else if (start_date) {
      where.createdAt = { [Op.gte]: new Date(start_date) };
    } else if (end_date) {
      where.createdAt = { [Op.lte]: new Date(new Date(end_date).setHours(23, 59, 59, 999)) };
    }


    // 🔹 Fetch Billing + related items + products
    const { count, rows } = await Billing.findAndCountAll({
      where,
      order: [[sort_by, sort_order]],
      offset,
      limit: parsedLimit,
      include: [
        {
          model: BillingItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "product_name", "unit"],
            },
          ],
        },
      ],
      attributes: [
        "id",
        "billing_no",
        "customer_name",
        "customer_phone",
        "type",
        "billing_date",
        "total_quantity",
        "subtotal_amount",
        "discount_amount",
        "tax_amount",
        "total_amount",
        "paid_amount",
        "due_amount",
        "payment_method",
        "status",
        "createdAt",
      ],
    });

    const totalPages = Math.ceil(count / parsedLimit);

    // ✅ If user requested download
    if (download_type) {
      const filePath = await this.generateDownloadFilebilling(rows, download_type);
      return { success: true, filePath };
    }

    // ✅ Return paginated JSON
    return {
      success: true,
      meta: {
        total_records: count,
        total_pages: totalPages,
        current_page: parsedPage,
        per_page: parsedLimit,
      },
      filters_applied: {
        search,
        start_date,
        end_date,
        status,
        payment_method,
      },
      data: rows,
    };
  },

  // 📄 Generate Excel or PDF
  async generateDownloadFilebilling(rows, type) {
    const downloadsDir = path.resolve("downloads");
    if (!fs.existsSync(downloadsDir)) fs.mkdirSync(downloadsDir);

    // 🟢 Excel Export
    if (type === "excel") {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Billing Report");

      worksheet.columns = [
        { header: "Billing No", key: "billing_no", width: 20 },
        { header: "Customer", key: "customer_name", width: 25 },
        { header: "Phone", key: "customer_phone", width: 15 },
        { header: "Type", key: "type", width: 20 },
        { header: "Status", key: "status", width: 15 },
        { header: "Payment", key: "payment_method", width: 20 },
        { header: "Total", key: "total_amount", width: 15 },
        { header: "Paid", key: "paid_amount", width: 15 },
        { header: "Due", key: "due_amount", width: 15 },
        { header: "Billing Date", key: "billing_date", width: 20 },
        { header: "Products", key: "products", width: 50 },
      ];

      rows.forEach((bill) => {
        const productList = bill.items
          ?.map(
            (item) =>
              `${item.product?.product_name || "-"} (${item.quantity} ${item.product?.unit || ""})`
          )
          .join(", ");

        worksheet.addRow({
          billing_no: bill.billing_no,
          customer_name: bill.customer_name || "-",
          customer_phone: bill.customer_phone || "-",
          type: bill.type,
          status: bill.status,
          payment_method: bill.payment_method,
          total_amount: bill.total_amount,
          paid_amount: bill.paid_amount,
          due_amount: bill.due_amount,
          billing_date: new Date(bill.billing_date).toLocaleString(),
          products: productList || "-",
        });
      });

      const filePath = path.join(downloadsDir, `Billing_Report_${Date.now()}.xlsx`);
      await workbook.xlsx.writeFile(filePath);
      return filePath;
    }

    // 🔵 PDF Export
    if (type === "pdf") {
      const doc = new jsPDF();
      doc.text("Billing Report", 14, 15);

      const tableData = rows.map((bill) => [
        bill.billing_no,
        bill.customer_name || "-",
        bill.customer_phone || "-",
        bill.type,
        bill.status,
        bill.payment_method,
        bill.total_amount,
        new Date(bill.billing_date).toLocaleDateString(),
      ]);

      autoTable(doc, {
        head: [
          ["Bill No", "Customer", "Phone", "Type", "Status", "Payment", "Total", "Date"],
        ],
        body: tableData,
        startY: 20,
      });

      const filePath = path.join(downloadsDir, `Billing_Report_${Date.now()}.pdf`);
      doc.save(filePath);
      return filePath;
    }

    throw new Error("Invalid download type");
  },
};

export default reportService;
