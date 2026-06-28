import StudyPlan from "../models/StudyPlan.js";

export const getStudyPlans = async (req, res) => {
  try {
    const plans = await StudyPlan.find({ user: req.user.userId }).sort({ createdAt: -1 });
    return res.status(200).json(plans);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to fetch study plans" });
  }
};

export const saveStudyPlan = async (req, res) => {
  try {
    const { goal, hoursPerDay, duration, weeks } = req.body;
    
    if (!goal || !hoursPerDay || !duration || !weeks) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newPlan = await StudyPlan.create({
      user: req.user.userId,
      goal,
      hoursPerDay,
      duration,
      weeks,
    });

    return res.status(201).json(newPlan);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to save study plan" });
  }
};

export const updateStudyPlanDay = async (req, res) => {
  try {
    const { id } = req.params;
    const { weekIndex, dayIndex, completed } = req.body;

    const plan = await StudyPlan.findOne({ _id: id, user: req.user.userId });
    
    if (!plan) {
      return res.status(404).json({ message: "Study plan not found" });
    }

    if (
      !plan.weeks[weekIndex] || 
      !plan.weeks[weekIndex].days[dayIndex]
    ) {
      return res.status(400).json({ message: "Invalid week or day index" });
    }

    plan.weeks[weekIndex].days[dayIndex].completed = completed;
    await plan.save();

    return res.status(200).json(plan);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to update study plan" });
  }
};

export const deleteStudyPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await StudyPlan.findOneAndDelete({ _id: id, user: req.user.userId });
    
    if (!plan) {
      return res.status(404).json({ message: "Study plan not found" });
    }

    return res.status(200).json({ message: "Study plan deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to delete study plan" });
  }
};
