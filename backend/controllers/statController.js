const Visit = require('../models/Visit');
const Contact = require('../models/Contact');
const Product = require('../models/Product');

exports.getStats = async (req, res) => {
    try {
        const { from, to, groupBy } = req.query;
        const start = from ? new Date(from) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const end = to ? new Date(to) : new Date();

        // group stage cho visits
        let groupId;
        if (groupBy === 'year') {
            groupId = { year: { $year: "$createdAt" } };
        } else if (groupBy === 'month') {
            groupId = { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } };
        } else {
            groupId = {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
                day: { $dayOfMonth: "$createdAt" }
            };
        }

        // Thống kê lượt truy cập (page view)
        const visits = await Visit.aggregate([
            { $match: { createdAt: { $gte: start, $lte: end } } },
            { $group: { _id: groupId, total: { $sum: 1 } } },
            { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
        ]);

        // Thống kê visitor duy nhất trong khoảng thời gian
        const uniqueVisitorsAgg = await Visit.aggregate([
            { $match: { createdAt: { $gte: start, $lte: end } } },
            { $group: { _id: "$visitorId" } },
            { $count: "uniqueCount" }
        ]);
        const uniqueVisitors = uniqueVisitorsAgg[0]?.uniqueCount || 0;

        // Thống kê liên hệ
        const contacts = await Contact.aggregate([
            { $match: { createdAt: { $gte: start, $lte: end } } },
            { $group: { _id: null, total: { $sum: 1 } } }
        ]);

        // Số hôm nay
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const todayVisits = await Visit.countDocuments({ createdAt: { $gte: todayStart, $lte: todayEnd } });
        const todayContacts = await Contact.countDocuments({ createdAt: { $gte: todayStart, $lte: todayEnd } });

        // Đếm sản phẩm sale theo project và lấy luôn tên dự án
        const products = await Product.aggregate([
            { $match: { status: 'sale' } },
            { $group: { _id: "$project", total: { $sum: 1 } } },
            {
                $lookup: {
                    from: 'projects',          // tên collection Project trong MongoDB
                    localField: '_id',         // _id hiện tại chính là project id
                    foreignField: '_id',       // _id của Project
                    as: 'projectInfo'
                }
            },
            { $unwind: '$projectInfo' },
            {
                $project: {
                    _id: '$projectInfo.name',
                    total: 1
                }
            },
            { $sort: { total: -1 } }
        ]);

        res.json({
            todayVisits,
            todayContacts,
            visits,
            uniqueVisitors, // trả về thêm số visitor duy nhất
            contacts,
            products
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};
