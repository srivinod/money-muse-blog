
import { PiggyBank, LineChart, DollarSign, ShoppingBag, Landmark } from "lucide-react";

export const categories = [
  {
    title: "Saving Money",
    slug: "saving",
    description: "Strategies to build your savings and secure your financial future",
    icon: <PiggyBank className="h-6 w-6 text-primary" />,
    longDescription: "Discover practical tips and strategies to boost your savings rate, maximize your emergency fund, and create a solid financial safety net. From automated savings techniques to cutting unnecessary expenses, learn how to make your money work smarter for you."
  },
  {
    title: "Budgeting",
    slug: "budgeting",
    description: "Take control of your finances with effective budgeting techniques",
    icon: <DollarSign className="h-6 w-6 text-primary" />,
    longDescription: "Master your money with powerful budgeting strategies that work for your lifestyle. Learn how to track expenses, allocate funds effectively, and find the perfect balance between saving and spending. Our budgeting guides will help you create a financial plan that brings you peace of mind."
  },
  {
    title: "Investing",
    slug: "investing",
    description: "Grow your wealth through smart investment decisions",
    icon: <LineChart className="h-6 w-6 text-primary" />,
    longDescription: "Navigate the world of investments with confidence. From stocks and bonds to retirement accounts and real estate, explore different investment vehicles and strategies tailored to your goals and risk tolerance. Learn how to build a diversified portfolio that can weather market fluctuations and grow your wealth over time."
  },
  {
    title: "Frugal Living",
    slug: "frugal-living",
    description: "Live well while spending less and saving more",
    icon: <ShoppingBag className="h-6 w-6 text-primary" />,
    longDescription: "Embrace the frugal lifestyle without feeling deprived. Discover creative ways to reduce your spending while maintaining a high quality of life. From smart shopping techniques to DIY solutions, learn how small changes in your daily habits can lead to significant savings over time."
  },
  {
    title: "Financial Planning",
    slug: "financial-planning",
    description: "Create a roadmap for your financial future and goals",
    icon: <Landmark className="h-6 w-6 text-primary" />,
    longDescription: "Build a comprehensive financial plan that aligns with your life goals. Whether you're planning for retirement, saving for a home, or creating an education fund, our financial planning resources will help you make informed decisions at every stage of life. Learn how to set meaningful financial goals and develop strategies to achieve them."
  }
];

export const featuredPosts = [
  {
    title: "7 Simple Steps to Create an Emergency Fund That Actually Works",
    slug: "create-emergency-fund",
    excerpt: "An emergency fund is your financial safety net. Learn how to build one that can truly support you when unexpected expenses arise.",
    category: "Saving Money",
    date: "April 10, 2023",
    author: "Sarah Mitchell",
    imageUrl: "https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "The 50/30/20 Budget Rule: How to Simplify Your Financial Life",
    slug: "50-30-20-budget-rule",
    excerpt: "Struggling with complex budgeting systems? The 50/30/20 rule might be the simple solution you've been looking for.",
    category: "Budgeting",
    date: "March 25, 2023",
    author: "Michael Taylor",
    imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Index Funds vs. Individual Stocks: Which Is Right For You?",
    slug: "index-funds-vs-individual-stocks",
    excerpt: "Deciding between index funds and individual stocks? This comprehensive comparison will help you make the best choice for your investment strategy.",
    category: "Investing",
    date: "April 2, 2023",
    author: "David Wong",
    imageUrl: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
];

export const latestPosts = [
  {
    title: "How to Save $10,000 in One Year (Even on an Average Salary)",
    slug: "save-10000-in-one-year",
    excerpt: "Think saving $10,000 in a year is impossible on your income? Think again. This step-by-step plan shows you exactly how to do it.",
    category: "Saving Money",
    date: "April 12, 2023",
    author: "Sarah Mitchell",
    imageUrl: "https://images.unsplash.com/photo-1622186477895-f2af6a0f5a97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Meal Planning on a Budget: Eat Well for Less Than $75 a Week",
    slug: "meal-planning-on-budget",
    excerpt: "A complete guide to planning nutritious, delicious meals without breaking the bank. Includes a 4-week meal plan and shopping list.",
    category: "Frugal Living",
    date: "April 8, 2023",
    author: "Jessica Chen",
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "How to Talk to Your Partner About Money (Without Fighting)",
    slug: "talk-to-partner-about-money",
    excerpt: "Financial discussions can be tense. Learn how to have productive money conversations that strengthen your relationship instead of straining it.",
    category: "Financial Planning",
    date: "April 5, 2023",
    author: "Emily Rodriguez",
    imageUrl: "https://images.unsplash.com/photo-1573497161161-c3e73707e25c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "The Beginner's Guide to Retirement Accounts: 401(k)s, IRAs, and More",
    slug: "beginners-guide-retirement-accounts",
    excerpt: "Confused about retirement account options? This straightforward guide explains everything you need to know to start planning for retirement today.",
    category: "Investing",
    date: "April 3, 2023",
    author: "David Wong",
    imageUrl: "https://images.unsplash.com/photo-1559938758-28a46020a8e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Zero-Based Budgeting: The Method That Gives Every Dollar a Purpose",
    slug: "zero-based-budgeting",
    excerpt: "Take control of your spending by assigning a job to every dollar you earn. Learn how zero-based budgeting can transform your financial life.",
    category: "Budgeting",
    date: "March 30, 2023",
    author: "Michael Taylor",
    imageUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "10 Frugal Habits That Helped Me Pay Off $45,000 in Debt",
    slug: "frugal-habits-pay-off-debt",
    excerpt: "These simple lifestyle changes helped me eliminate my student loans and credit card debt in just three years. See which ones could work for you.",
    category: "Frugal Living",
    date: "March 27, 2023",
    author: "Jessica Chen",
    imageUrl: "https://images.unsplash.com/photo-1434626881859-194d67b2b86f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
];

export const resources = [
  {
    title: "Budget Planner Spreadsheet",
    description: "A comprehensive Excel template to track your income, expenses, and savings goals.",
    icon: <DollarSign className="h-6 w-6 text-primary" />,
    link: "#"
  },
  {
    title: "Compound Interest Calculator",
    description: "See how your investments can grow over time with the power of compound interest.",
    icon: <LineChart className="h-6 w-6 text-primary" />,
    link: "#"
  },
  {
    title: "Debt Payoff Planner",
    description: "Compare debt snowball vs. avalanche methods and create your personalized debt elimination plan.",
    icon: <ShoppingBag className="h-6 w-6 text-primary" />,
    link: "#"
  },
  {
    title: "Retirement Calculator",
    description: "Estimate how much you need to save for a comfortable retirement based on your goals.",
    icon: <Landmark className="h-6 w-6 text-primary" />,
    link: "#"
  },
  {
    title: "Emergency Fund Calculator",
    description: "Determine how much you should have in your emergency fund based on your personal situation.",
    icon: <PiggyBank className="h-6 w-6 text-primary" />,
    link: "#"
  },
  {
    title: "50/30/20 Budget Template",
    description: "A simple template to implement the popular 50/30/20 budgeting rule in your financial life.",
    icon: <DollarSign className="h-6 w-6 text-primary" />,
    link: "#"
  }
];
