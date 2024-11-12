function Dashboard () {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const location = useLocation();

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.currint && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    },[]);

    return (
        <div className='flex'>
            {location.pathname !== '/master' && (
                <div className='border-r w-48 h-[92vh] overflow-y-scroll'>
                    <div>
                        <div className='text-center py-2 pt-4'></div>
                        <div className='text-center py-2 pt-4 text-lg'></div>
                        <div className={`text-center py-2 text-lg ${location.pathname.includes("/master/vendors") && "font-bold border-l-4 border-blue-600"}`}><Link to="vendors">消費税設定</Link></div>
                    </div>
                </div>
            )}
        </div>
    )
}