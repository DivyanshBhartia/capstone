"use client";
import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Check, Trash2, Plus } from "lucide-react";

// Card and Input components (reuse from Lists/page.js or define minimal versions)
const Card = ({ children, className = "", onClick, ...props }) => (
  <div 
    className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}
    onClick={onClick}
    {...props}
  >
    {children}
  </div>
);

const Input = React.forwardRef(({ className = "", type = "text", ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
));
Input.displayName = "Input";

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

function ListEditor({ list, onUpdate, onBack }) {
  const [title, setTitle] = useState(list.title);
  const [items, setItems] = useState(list.items);
  const [newItemText, setNewItemText] = useState("");
  const titleInputRef = useRef(null);
  const newItemInputRef = useRef(null);
  const [isDirty, setIsDirty] = useState(false);

  const handleAddItem = () => {
    if (newItemText.trim()) {
      const newItem = {
        id: Date.now().toString(),
        text: newItemText.trim(),
        completed: false,
      };
      setItems(prev => [...prev, newItem]);
      setNewItemText("");
      newItemInputRef.current?.focus();
      setIsDirty(true);
    }
  };

  const handleDeleteItem = (itemId) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
    setIsDirty(true);
  };

  const handleToggleItem = (itemId) => {
    setItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    );
    setIsDirty(true);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setIsDirty(true);
  };

  const handleSave = () => {
    const updatedList = { ...list, title: title.trim() || "Untitled List", items };
    // Update localStorage
    const stored = typeof window !== 'undefined' ? localStorage.getItem("groceryLists") : null;
    let allLists = [];
    if (stored) {
      try {
        const parsed = JSON.parse(stored).map(l => ({
          ...l,
          createdAt: new Date(l.createdAt),
        }));
        allLists = parsed.map(l => l.id === updatedList.id ? updatedList : l);
      } catch {
        allLists = [updatedList];
      }
    } else {
      allLists = [updatedList];
    }
    localStorage.setItem("groceryLists", JSON.stringify(allLists));
    setIsDirty(false);
    if (onUpdate) onUpdate(updatedList);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="rounded-full bg-muted px-4 py-2 text-sm font-medium hover:bg-muted/80"
            >
              <ArrowLeft className="h-4 w-4 mr-2 inline" />
              Back
            </button>
            <Input
              ref={titleInputRef}
              value={title}
              onChange={handleTitleChange}
              placeholder="Enter list title..."
              className="text-2xl font-bold border-0 bg-transparent p-0 focus-visible:ring-0 flex-1"
              style={{ maxWidth: 400 }}
            />
            <button
              onClick={handleSave}
              disabled={!isDirty}
              className="ml-auto bg-primary text-primary-foreground hover:bg-primary/90 px-6 font-medium rounded-full transition-all duration-200 disabled:opacity-50"
            >
              Save
            </button>
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
              <button
                onClick={handleAddItem}
                disabled={!newItemText.trim()}
                className="rounded-full bg-primary text-primary-foreground px-4 py-2 font-medium hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </Card>

          {/* Items List */}
          <div className="space-y-3">
            {items.length > 0 ? (
              items.map((item) => (
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
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full px-2 py-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-8 bg-grocery-card border border-dashed border-border text-center">
                <div className="text-grocery-text-light">
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

export default function ListPage() {
  const params = useParams();
  const router = useRouter();
  const [list, setList] = useState(null);

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem("groceryLists") : null;
    const sampleLists = createSampleLists();
    let allLists = [];
    if (stored) {
      try {
        const parsed = JSON.parse(stored).map(list => ({
          ...list,
          createdAt: new Date(list.createdAt),
        }));
        // Merge in sample lists that are missing (by id)
        const allIds = new Set(parsed.map(l => l.id));
        allLists = [
          ...parsed,
          ...sampleLists.filter(sample => !allIds.has(sample.id)),
        ];
      } catch {
        allLists = sampleLists;
      }
    } else {
      allLists = sampleLists;
    }
    const found = allLists.find(l => l.id === params.id);
    setList(found || null);
  }, [params.id]);

  if (!list) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-500">List not found</div>
        <button onClick={() => router.push('/Lists')} className="ml-4 px-4 py-2 rounded bg-primary text-white">Back to Lists</button>
      </div>
    );
  }

  return <ListEditor list={list} onUpdate={setList} onBack={() => router.push('/Lists')} />;
} 