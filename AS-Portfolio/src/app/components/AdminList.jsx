import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    PlusCircle, List, FilePlus, FolderPlus, BookOpen, Award, MessageSquare, Mail, FileText, LayoutDashboard, Eye,
    Shapes
} from 'lucide-react';

const AdminList = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 5 },
        visible: { opacity: 1, y: 0 }
    };

    const tapEffect = {
        scale: 1
    };

    const menuItems = [
        { href: '/addHeader', text: 'Create Header', icon: <PlusCircle size={20} /> },
        { href: '/allHeaders', text: 'All Headers', icon: <List size={20} /> },
        { href: '/addProject', text: 'Create Project', icon: <FilePlus size={20} /> },
        { href: '/allProjects', text: 'All Projects', icon: <FolderPlus size={20} /> },
        { href: '/addCategory', text: 'Create Category', icon: <Shapes size={20} /> },
        { href: '/allCategories', text: 'All Categories', icon: <Shapes size={20} /> },
        { href: '/addSkill', text: 'Create Skill', icon: <PlusCircle size={20} /> },
        { href: '/allSkills', text: 'All Skills', icon: <List size={20} /> },
        { href: '/addCertificate', text: 'Create Certificate', icon: <Award size={20} /> },
        { href: '/allCertificates', text: 'All Certificates', icon: <List size={20} /> },
        { href: '/allFeedbacks', text: 'All Feedbacks', icon: <MessageSquare size={20} /> },
        { href: '/Subscribe-Page', text: 'All Subscribes', icon: <Mail size={20} /> },
        { href: '/contacts', text: 'Contacts', icon: <Mail size={20} /> },
        { href: '/blog/create-post-open', text: 'Create Blog', icon: <FileText size={20} /> },
        { href: '/blog/admin-posts', text: 'All Blogs', icon: <List size={20} /> },
        { href: '/Dashboard', text: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { href: '/visits', text: 'Visits', icon: <Eye size={20} /> }
    ];

    return (
        <div className='flex items-center justify-center my-4'>
            <motion.ul
                className="menu rounded-box bg-neutral px-6 py-3 h-full w-full md:w-[50%] sm:w-[70%] max-sm:w-[70%]"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {menuItems.map((item, index) => (
                    <Link
                        href={item.href}
                        className='border my-2  border-base-100 rounded-md text-base-100 bg-primary block w-full transition-colors duration-200'
                        key={index}
                    >
                        <motion.li
                            variants={itemVariants}
                            whileTap={tapEffect}
                            className='w-full text-center flex flex-row items-center py-1 gap-2 hover:bg-neutral transition-all'
                        >
                            <p className="flex justify-center mx-auto text-center text-[16px] font-semibold">{item.text} {item.icon}</p>
                        </motion.li>
                    </Link>
                ))}
            </motion.ul>
        </div>
    );
};

export default AdminList;