import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    PlusCircle, List, FilePlus, FolderPlus, BookOpen, Award, MessageSquare, Mail, FileText, LayoutDashboard, Eye,
    Shapes, Settings, Database, BarChart3, Users, Image, Briefcase
} from 'lucide-react';

const AdminList = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.9 },
        visible: { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            transition: { type: "spring", stiffness: 300, damping: 24 }
        }
    };

    const menuItems = [
        { 
            href: '/Dashboard', 
            text: 'Dashboard', 
            icon: <LayoutDashboard size={22} />,
            color: 'from-primary to-secondary',
            category: 'Overview'
        },
        { 
            href: '/addHeader', 
            text: 'Create Header', 
            icon: <Image size={22} />,
            color: 'from-primary to-accent',
            category: 'Content'
        },
        { 
            href: '/allHeaders', 
            text: 'All Headers', 
            icon: <List size={22} />,
            color: 'from-secondary to-primary',
            category: 'Content'
        },
        { 
            href: '/addProject', 
            text: 'Create Project', 
            icon: <FilePlus size={22} />,
            color: 'from-accent to-primary',
            category: 'Projects'
        },
        { 
            href: '/allProjects', 
            text: 'All Projects', 
            icon: <FolderPlus size={22} />,
            color: 'from-primary to-secondary',
            category: 'Projects'
        },
        { 
            href: '/addExperience', 
            text: 'Create Experience', 
            icon: <Briefcase size={22} />,
            color: 'from-amber-500 to-orange-600',
            category: 'Experience'
        },
        { 
            href: '/allExperiences', 
            text: 'All Experiences', 
            icon: <List size={22} />,
            color: 'from-orange-600 to-red-500',
            category: 'Experience'
        },
        { 
            href: '/addCategory', 
            text: 'Create Category', 
            icon: <Shapes size={22} />,
            color: 'from-secondary to-accent',
            category: 'Content'
        },
        { 
            href: '/allCategories', 
            text: 'All Categories', 
            icon: <Database size={22} />,
            color: 'from-accent to-secondary',
            category: 'Content'
        },
        { 
            href: '/addSkill', 
            text: 'Create Skill', 
            icon: <PlusCircle size={22} />,
            color: 'from-primary to-accent',
            category: 'Skills'
        },
        { 
            href: '/allSkills', 
            text: 'All Skills', 
            icon: <Settings size={22} />,
            color: 'from-secondary to-primary',
            category: 'Skills'
        },
        { 
            href: '/addCertificate', 
            text: 'Create Certificate', 
            icon: <Award size={22} />,
            color: 'from-accent to-primary',
            category: 'Achievements'
        },
        { 
            href: '/allCertificates', 
            text: 'All Certificates', 
            icon: <List size={22} />,
            color: 'from-primary to-secondary',
            category: 'Achievements'
        },
        { 
            href: '/allFeedbacks', 
            text: 'All Feedbacks', 
            icon: <MessageSquare size={22} />,
            color: 'from-secondary to-accent',
            category: 'Interactions'
        },
        { 
            href: '/Subscribe-Page', 
            text: 'All Subscribes', 
            icon: <Users size={22} />,
            color: 'from-accent to-primary',
            category: 'Interactions'
        },
        { 
            href: '/contacts', 
            text: 'Contacts', 
            icon: <Mail size={22} />,
            color: 'from-primary to-secondary',
            category: 'Interactions'
        },
        { 
            href: '/pending-questions', 
            text: 'Pending Questions', 
            icon: <MessageSquare size={22} />,
            color: 'from-warning to-error',
            category: 'Interactions'
        },
        { 
            href: '/blog/create-post-open', 
            text: 'Create Blog', 
            icon: <FileText size={22} />,
            color: 'from-secondary to-accent',
            category: 'Blog'
        },
        { 
            href: '/blog/admin-posts', 
            text: 'All Blogs', 
            icon: <BookOpen size={22} />,
            color: 'from-accent to-primary',
            category: 'Blog'
        },
        { 
            href: '/visits', 
            text: 'Visits Analytics', 
            icon: <BarChart3 size={22} />,
            color: 'from-primary to-secondary',
            category: 'Analytics'
        }
    ];

    const categories = [...new Set(menuItems.map(item => item.category))];

    return (
        <div className="min-h-screen bg-base-100 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-bold text-primary mb-4">
                        Admin Dashboard
                    </h1>
                    <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
                        Manage your portfolio content, track analytics, and control all aspects of your website
                    </p>
                </motion.div>

                <div className="space-y-8">
                    {categories.map((category, categoryIndex) => (
                        <motion.div
                            key={category}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: categoryIndex * 0.1 }}
                            className="bg-base-200 rounded-3xl p-6 shadow-lg border border-base-300"
                        >
                            <h2 className="text-2xl font-bold text-base-content mb-6 flex items-center gap-3">
                                <div className="w-2 h-8 bg-gradient-to-b from-primary to-secondary rounded-full" />
                                {category}
                            </h2>
                            
                            <motion.div
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {menuItems
                                    .filter(item => item.category === category)
                                    .map((item, index) => (
                                        <motion.div
                                            key={item.href}
                                            variants={itemVariants}
                                            whileHover={{ 
                                                scale: 1.05,
                                                y: -5,
                                                transition: { type: "spring", stiffness: 400, damping: 25 }
                                            }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Link href={item.href}>
                                                <div className="group relative bg-base-100 rounded-2xl p-6 shadow-lg border border-base-300 hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer">
                                                    <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                                                    
                                                    <div className="relative z-10">
                                                        <div className={`inline-flex items-center justify-center p-3 rounded-xl bg-gradient-to-br ${item.color} text-base-content shadow-lg mb-4`}>
                                                            {item.icon}
                                                        </div>
                                                        
                                                        <h3 className="text-lg font-semibold text-base-content mb-2 group-hover:text-base-content/90 transition-colors">
                                                            {item.text}
                                                        </h3>
                                                        
                                                        <div className="flex items-center text-base-content/60 group-hover:text-base-content/70 transition-colors">
                                                            <span className="text-sm">Manage content</span>
                                                            <motion.div
                                                                className="ml-2 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300"
                                                                initial={false}
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                                </svg>
                                                            </motion.div>
                                                        </div>
                                                    </div>

                                                    <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${item.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))}
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminList;