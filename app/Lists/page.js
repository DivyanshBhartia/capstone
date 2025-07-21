"use client";
import React, { useState, useEffect, useRef } from "react";
import { Search, Plus, Eye, ShoppingCart, Sparkles, Trash2, ArrowLeft, Check } from "lucide-react";

// Add this CSS to your global styles or include it in your project
const CSS_VARIABLES = `
:root {
  --background: 217 23% 97%;
  --foreground: 220 13% 18%;
  --card: 0 0% 100%;
  --card-foreground: 220 13% 18%;
  --primary: 122 39% 49%;
  --primary-foreground: 0 0% 100%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 220 13% 18%;
  --muted: 210 40% 96%;
  --muted-foreground: 220 9% 46%;
  --accent: 210 40% 96%;
  --accent-foreground: 220 13% 18%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 100%;
  --border: 220 13% 91%;
  --input: 220 13% 91%;
  --ring: 122 39% 49%;
  --grocery-primary: 122 39% 49%;
  --grocery-primary-light: 122 39% 85%;
  --grocery-accent: 32 95% 60%;
  --grocery-text: 220 13% 18%;
  --grocery-text-light: 220 9% 46%;
  --grocery-bg: 217 23% 97%;
  --grocery-card: 0 0% 100%;
  --shadow-card: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-card-hover: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --transition-smooth: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  --radius: 0.5rem;
}
`;

// Basic UI Components (replace with your UI library components)
const Card = ({ children, className = "", onClick, ...props }) => (
  <div 
    className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}
    onClick={onClick}
    {...props}
  >
    {children}
  </div>
);

const Button = ({ children, className = "", variant = "default", size = "default", disabled, onClick, ...props }) => {
  const baseClasses = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground"
  };
  
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8"
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ className = "", type = "text", ...props }) => (
  <input
    type={type}
    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

// Header Component
function Header({ searchQuery, onSearchChange, onCreateList }) {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search your grocery lists..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 rounded-full border-border bg-background"
              />
            </div>
          </div>

          {/* Create List Button */}
          <Button 
            onClick={onCreateList}
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 font-medium transition-all duration-200 hover:shadow-md"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create List
          </Button>
        </div>
      </div>
    </header>
  );
}

// SearchResults Component
function SearchResults({ query, results, onSelectList }) {
  if (!query) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
      {results.length > 0 ? (
        <div className="p-2">
          <div className="text-sm text-muted-foreground p-2 border-b">
            Found {results.length} list{results.length !== 1 ? 's' : ''}
          </div>
          {results.map((list) => (
            <Card
              key={list.id}
              className="p-3 m-1 cursor-pointer hover:bg-accent/50 transition-colors border-0 bg-transparent"
              onClick={() => onSelectList(list)}
            >
              <div className="flex items-start gap-3">
                <ShoppingCart className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-foreground truncate">
                    {list.title || "Untitled List"}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {list.items.length} item{list.items.length !== 1 ? 's' : ''} • {list.createdAt.toLocaleDateString()}
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
          <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
          <p className="text-sm text-muted-foreground">No matching lists found</p>
          <p className="text-xs text-muted-foreground">Try a different search term</p>
        </div>
      )}
    </div>
  );
}

// ListCard Component
function ListCard({ list, onView }) {
  const previewItems = list.items.slice(0, 3);
  const hasMoreItems = list.items.length > 3;

  return (
    <Card className="p-6 bg-grocery-card border border-border hover:shadow-card-hover transition-all duration-200 hover:scale-[1.02] cursor-pointer group">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-lg text-grocery-text truncate">
              {list.title || "Untitled List"}
            </h3>
          </div>
          <span className="text-sm text-grocery-text-light">
            {list.createdAt.toLocaleDateString()}
          </span>
        </div>

        {/* Items Preview */}
        <div className="space-y-2">
          {previewItems.length > 0 ? (
            <>
              {previewItems.map((item) => (
                <div key={item.id} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-primary/20 rounded-full" />
                  <span className="text-grocery-text-light truncate">{item.text}</span>
                </div>
              ))}
              {hasMoreItems && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-primary/20 rounded-full" />
                  <span className="text-grocery-text-light">
                    ... and {list.items.length - 3} more items
                  </span>
                </div>
              )}
            </>
          ) : (
            <p className="text-grocery-text-light text-sm italic">No items yet</p>
          )}
        </div>

        {/* View Button */}
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onView(list);
          }}
          variant="outline"
          size="sm"
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200"
        >
          <Eye className="h-4 w-4 mr-2" />
          View List
        </Button>
      </div>
    </Card>
  );
}

// ListEditor Component
function ListEditor({ list, onUpdate, onBack }) {
  const [title, setTitle] = useState(list.title);
  const [newItemText, setNewItemText] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(!list.title);
  const titleInputRef = useRef(null);
  const newItemInputRef = useRef(null);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditingTitle]);

  const handleTitleSave = () => {
    setIsEditingTitle(false);
    onUpdate({ ...list, title: title.trim() || "Untitled List" });
  };

  const handleAddItem = () => {
    if (newItemText.trim()) {
      const newItem = {
        id: Date.now().toString(),
        text: newItemText.trim(),
        completed: false,
      };
      onUpdate({
        ...list,
        items: [...list.items, newItem],
      });
      setNewItemText("");
      newItemInputRef.current?.focus();
    }
  };

  const handleDeleteItem = (itemId) => {
    onUpdate({
      ...list,
      items: list.items.filter(item => item.id !== itemId),
    });
  };

  const handleToggleItem = (itemId) => {
    onUpdate({
      ...list,
      items: list.items.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      ),
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="rounded-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            {isEditingTitle ? (
              <div className="flex-1 flex gap-2">
                <Input
                  ref={titleInputRef}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter list title..."
                  onKeyDown={(e) => e.key === "Enter" && handleTitleSave()}
                  onBlur={handleTitleSave}
                  className="text-2xl font-bold border-0 bg-transparent p-0 focus-visible:ring-0"
                />
                <Button size="sm" onClick={handleTitleSave}>
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <h1
                className="text-2xl font-bold text-grocery-text cursor-pointer hover:text-primary transition-colors"
                onClick={() => setIsEditingTitle(true)}
              >
                {title || "Untitled List"}
              </h1>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Add New Item */}
          <Card className="p-4 bg-grocery-card border border-border">
            <div className="flex gap-2">
              <Input
                ref={newItemInputRef}
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                placeholder="Add item to your grocery list..."
                onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
                className="flex-1"
              />
              <Button
                onClick={handleAddItem}
                disabled={!newItemText.trim()}
                className="rounded-full"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </Card>

          {/* Items List */}
          <div className="space-y-3">
            {list.items.length > 0 ? (
              list.items.map((item) => (
                <Card
                  key={item.id}
                  className="p-4 bg-grocery-card border border-border hover:shadow-card transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleItem(item.id)}
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        item.completed
                          ? "bg-primary border-primary"
                          : "border-border hover:border-primary"
                      }`}
                    >
                      {item.completed && (
                        <Check className="h-3 w-3 text-primary-foreground" />
                      )}
                    </button>
                    
                    <span
                      className={`flex-1 transition-all duration-200 ${
                        item.completed
                          ? "text-grocery-text-light line-through"
                          : "text-grocery-text"
                      }`}
                    >
                      {item.text}
                    </span>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-8 bg-grocery-card border border-dashed border-border text-center">
                <div className="text-grocery-text-light">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Your grocery list is empty</p>
                  <p className="text-sm">Start adding items to get organized!</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Sample data creation
const createSampleLists = () => [
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

// Main GroceryListApp Component
export default function Lists() {
  const [lists, setLists] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentView, setCurrentView] = useState("home");
  const [currentList, setCurrentList] = useState(null);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Initialize with sample data
  useEffect(() => {
    setLists(createSampleLists());
  }, []);

  // Get recent lists (5 most recent)
  const recentLists = lists
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  // Filter lists based on search query
  const searchResults = lists.filter(list =>
    list.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateList = () => {
    const newList = {
      id: Date.now().toString(),
      title: "",
      items: [],
      createdAt: new Date(),
    };
    setLists(prev => [newList, ...prev]);
    setCurrentList(newList);
    setCurrentView("editor");
    setSearchQuery("");
    setShowSearchResults(false);
  };

  const handleViewList = (list) => {
    setCurrentList(list);
    setCurrentView("editor");
    setSearchQuery("");
    setShowSearchResults(false);
  };

  const handleUpdateList = (updatedList) => {
    setLists(prev =>
      prev.map(list => (list.id === updatedList.id ? updatedList : list))
    );
    setCurrentList(updatedList);
  };

  const handleBackToHome = () => {
    setCurrentView("home");
    setCurrentList(null);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setShowSearchResults(query.trim().length > 0);
  };

  const handleSearchResultSelect = (list) => {
    handleViewList(list);
  };

  // Render current view
  if (currentView === "editor" && currentList) {
    return (
      <ListEditor
        list={currentList}
        onUpdate={handleUpdateList}
        onBack={handleBackToHome}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Add the CSS variables to your global styles */}
      <style>{CSS_VARIABLES}</style>
      
      {/* Header with Search */}
      <div className="relative">
        <Header
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onCreateList={handleCreateList}
        />
        
        {/* Search Results Dropdown */}
        {showSearchResults && (
          <div className="absolute inset-x-0 top-full z-50">
            <div className="container mx-auto px-4">
              <div className="max-w-md mx-auto relative">
                <SearchResults
                  query={searchQuery}
                  results={searchResults}
                  onSelectList={handleSearchResultSelect}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-grocery-text mb-4">
              Your Recent Grocery Lists
            </h2>
            <p className="text-grocery-text-light">
              Keep track of your shopping with organized, searchable lists
            </p>
          </div>

          {/* Recent Lists Grid */}
          {recentLists.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recentLists.map((list) => (
                <ListCard
                  key={list.id}
                  list={list}
                  onView={handleViewList}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <Card className="p-12 text-center bg-grocery-card border border-dashed border-border">
              <div className="max-w-sm mx-auto">
                <div className="relative mb-6">
                  <ShoppingCart className="h-16 w-16 text-primary/30 mx-auto" />
                  <Sparkles className="h-6 w-6 text-grocery-accent absolute -top-2 -right-2" />
                </div>
                <h3 className="text-xl font-semibold text-grocery-text mb-2">
                  Start Your First Grocery List!
                </h3>
                <p className="text-grocery-text-light mb-6">
                  Get organized and never forget an item again. Create your first list to get started.
                </p>
                <button
                  onClick={handleCreateList}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-full font-medium transition-all duration-200 hover:shadow-md"
                >
                  Create Your First List
                </button>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
