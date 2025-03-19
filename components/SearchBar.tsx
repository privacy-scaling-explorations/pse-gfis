interface SearchBarProps {
    handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar = (props: SearchBarProps) => {

    const {handleSearch} = props;
    
    return (
        <div className="search">
            <input type='text' placeholder='Search' className='rounded-[6px] px-3 w-full md:w-2/5 h-12 my-8 bg-transparent border-2 border-[#848D97] focus:outline-none' onChange={(e) => handleSearch(e)}/>
        </div>
    )
}

export default SearchBar;