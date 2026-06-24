const Vendor = require('../models/vendor');
const Admin  = require('../models/admin');

exports.getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find({})
      .select('-password -passwordResetToken -passwordResetExpires')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: vendors.length,
      data: vendors,
    });
  } catch (error) {
    console.error('❌ getAllVendors error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching vendors' });
  }
};

exports.approveVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }

    if (vendor.status === 'approved') {
      return res.status(400).json({ success: false, message: 'Vendor is already approved' });
    }

    vendor.status     = 'approved';
    vendor.approvedBy = req.user._id;  // set from protect middleware
    vendor.approvedAt = new Date();
    vendor.rejectionReason = '';       // clear any old rejection reason
    await vendor.save();

    // Log action on admin document
    await Admin.findByIdAndUpdate(req.user._id, {
      $push: {
        activityLog: {
          action:      'approved_vendor',
          targetModel: 'Vendor',
          targetId:    vendor._id,
          note:        `Approved shop: ${vendor.shopName}`,
          performedAt: new Date(),
        },
      },
    });

    console.log(`✅ Vendor approved: ${vendor.shopName} (${vendor._id}) by admin ${req.user._id}`);

    res.status(200).json({
      success: true,
      message: `Vendor "${vendor.shopName}" approved successfully`,
      data: {
        _id:      vendor._id,
        status:   vendor.status,
        shopName: vendor.shopName,
      },
    });
  } catch (error) {
    console.error('❌ approveVendor error:', error);
    res.status(500).json({ success: false, message: 'Server error approving vendor' });
  }
};

exports.rejectVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }

    if (vendor.status === 'rejected') {
      return res.status(400).json({ success: false, message: 'Vendor is already rejected' });
    }

    vendor.status          = 'rejected';
    vendor.rejectionReason = req.body.reason || '';
    vendor.approvedBy      = null;
    vendor.approvedAt      = null;
    await vendor.save();

    // Log action on admin document
    await Admin.findByIdAndUpdate(req.user._id, {
      $push: {
        activityLog: {
          action:      'rejected_vendor',
          targetModel: 'Vendor',
          targetId:    vendor._id,
          note:        `Rejected shop: ${vendor.shopName}. Reason: ${vendor.rejectionReason || 'none'}`,
          performedAt: new Date(),
        },
      },
    });

    console.log(`❌ Vendor rejected: ${vendor.shopName} (${vendor._id}) by admin ${req.user._id}`);

    res.status(200).json({
      success: true,
      message: `Vendor "${vendor.shopName}" rejected`,
      data: {
        _id:             vendor._id,
        status:          vendor.status,
        rejectionReason: vendor.rejectionReason,
      },
    });
  } catch (error) {
    console.error('❌ rejectVendor error:', error);
    res.status(500).json({ success: false, message: 'Server error rejecting vendor' });
  }
};
