"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

// Card component (copied from Lists page for consistent style)
const Card = ({ children, className = "", onClick, ...props }) => (
  <div 
    className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}
    onClick={onClick}
    {...props}
  >
    {children}
  </div>
);

function createSampleLists() {
  return [
    {
      id: "1",
      title: "Weekly Grocery Run",
      items: [
        { id: "1", text: "Organic bananas", completed: false },
        { id: "2", text: "Whole grain bread", completed: false },
        { id: "3", text: "Greek yogurt", completed: true },
        { id: "4", text: "Free-range eggs", completed: false },
        { id: "5", text: "Fresh spinach", completed: false },
      ],
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      id: "2",
      title: "Party Supplies",
      items: [
        { id: "6", text: "Chips and dips", completed: false },
        { id: "7", text: "Soft drinks", completed: false },
        { id: "8", text: "Ice cream", completed: false },
      ],
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: "3",
      title: "Healthy Meal Prep",
      items: [
        { id: "9", text: "Quinoa", completed: true },
        { id: "10", text: "Salmon fillets", completed: false },
        { id: "11", text: "Avocados", completed: false },
        { id: "12", text: "Bell peppers", completed: false },
      ],
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      id: "4",
      title: "Baking Essentials",
      items: [
        { id: "13", text: "All-purpose flour", completed: false },
        { id: "14", text: "Vanilla extract", completed: false },
      ],
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    },
    {
      id: "5",
      title: "Quick Snacks",
      items: [
        { id: "15", text: "Mixed nuts", completed: false },
        { id: "16", text: "Protein bars", completed: false },
        { id: "17", text: "Fresh fruit", completed: false },
      ],
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
  ];
}

function ListModal({ list, onClose }) {
  if (!list) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl">&times;</button>
        <h2 className="text-2xl font-bold mb-2">{list.title || "Untitled List"}</h2>
        <div className="text-sm text-gray-500 mb-4">{list.createdAt instanceof Date ? list.createdAt.toLocaleDateString() : new Date(list.createdAt).toLocaleDateString()}</div>
        <ul className="space-y-2">
          {list.items.length > 0 ? (
            list.items.map(item => (
              <li key={item.id} className="flex items-center gap-2">
                <span className={`inline-block w-2 h-2 rounded-full ${item.completed ? 'bg-primary' : 'bg-primary/20'}`}></span>
                <span className={item.completed ? 'line-through text-gray-400' : ''}>{item.text}</span>
              </li>
            ))
          ) : (
            <li className="italic text-gray-400">No items yet</li>
          )}
        </ul>
      </div>
    </div>
  );
}

function Landing() {
  const [lists, setLists] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const inputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem("groceryLists") : null;
    const sampleLists = createSampleLists();
    if (stored) {
      try {
        const parsed = JSON.parse(stored).map(list => ({
          ...list,
          createdAt: new Date(list.createdAt),
        }));
        // Merge in sample lists that are missing (by id)
        const allIds = new Set(parsed.map(l => l.id));
        const merged = [
          ...parsed,
          ...sampleLists.filter(sample => !allIds.has(sample.id)),
        ];
        setLists(merged.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
      } catch {
        setLists(sampleLists);
      }
    } else {
      setLists(sampleLists);
    }
  }, []);

  const searchResults = lists.filter(list =>
    list.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowSearchResults(e.target.value.trim().length > 0);
  };

  const handleSelectList = (list) => {
    setShowSearchResults(false);
    setSearchQuery("");
    // Navigate to Lists page with ?view=<id>
    router.push(`/Lists?view=${list.id}`);
  };

  return (
    <>
      <div className="h-[70vh] relative flex  items-center justify-center">
        <img
          src="/veggies.jpg"
          alt="food Image"
          className="w-full h-[70vh] object-cover  "
        />
        <div className="absolute  w-[80%] h-[65%] bg-amber-800/70 rounded-4xl flex justify-center items-center">
          <div className=" h-[80%] w-[90%]  flex justify-around items-center">
            <div className=" h-[80%] flex flex-col gap-16 justify-around font-">
              <div>
                <h1 className="text-white  text-6xl font-extrabold   ">
                  Need to list your grocceries?
                </h1>
                <h1 className="text-white  text-6xl font-extrabold  ">
                  Go with the pros.
                </h1>
              </div>
              <div className="flex  relative">
                <input
                  ref={inputRef}
                  type="text"
                  className="h-12 w-[70%]  rounded-l-[3px] rounded-r-none bg-white pl-12 text-lg "
                  placeholder="Enter list name..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setShowSearchResults(searchQuery.trim().length > 0)}
                />
                <button className="w-[30%] bg-red-400 rounded-r-[3px] rounded-l-none text-white font-bold font-mono">
                  Search
                </button>
                {/* Search Results Dropdown */}
                {showSearchResults && (
                  <div className="absolute left-0 top-full mt-2 w-[70%] z-50">
                    <div className="bg-white border border-border rounded-lg shadow-xl transition-all duration-200 z-50 max-h-96 overflow-y-auto w-full animate-fadeIn">
                      {searchResults.length > 0 ? (
                        <div className="p-2">
                          <div className="text-sm text-muted-foreground p-2 border-b">
                            Found {searchResults.length} list{searchResults.length !== 1 ? 's' : ''}
                          </div>
                          {searchResults.map((list) => (
                            <Card
                              key={list.id}
                              className="p-3 m-1 cursor-pointer hover:bg-accent/50 transition-colors border-0 bg-transparent"
                              onClick={() => handleSelectList(list)}
                            >
                              <div className="flex items-start gap-3">
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-sm text-foreground truncate">
                                    {list.title || "Untitled List"}
                                  </h4>
                                  <p className="text-xs text-muted-foreground">
                                    {list.items.length} item{list.items.length !== 1 ? 's' : ''} • {list.createdAt instanceof Date ? list.createdAt.toLocaleDateString() : new Date(list.createdAt).toLocaleDateString()}
                                  </p>
                                  {list.items.length > 0 && (
                                    <p className="text-xs text-muted-foreground mt-1 truncate">
                                      {list.items.slice(0, 3).map(item => item.text).join(', ')}
                                      {list.items.length > 3 ? '...' : ''}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center">
                          <p className="text-sm text-muted-foreground">No matching lists found</p>
                          <p className="text-xs text-muted-foreground">Try a different search term</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className=" h-[80%] text-white font-light text-2xl gap-y-4 flex flex-col justify-center">
              <p>Over a million users worldwide</p>
              <p>Anybody be it a mother,a father or kid can use it</p>
              <p>With a few simple steps make ur kitchen life easier</p>
            </div>
          </div>
        </div>
      </div>
      {/* List Modal */}
      <ListModal list={null} onClose={() => {}} />
    </>
  );
}

export default Landing;
