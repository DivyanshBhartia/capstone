"use client";
import SearchCaters from "./components/landing";
import { useEffect, useState } from "react";

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

// Sample data helper (same as Lists page)
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

export default function Home() {
  const [lists, setLists] = useState([]);

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

  const firstFive = lists.slice(0, 5);

  return (
    <>
      <div className="h-[80vh]">
        <SearchCaters />
      </div>
      <div className="max-w-6xl mx-auto px-4 mb-24">
        <h2 className="text-3xl font-bold text-grocery-text mb-4 text-center mb-14">Your Recent Grocery Lists</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {firstFive.map(list => {
            const previewItems = list.items.slice(0, 3);
            const hasMoreItems = list.items.length > 3;
            return (
              <Card key={list.id} className="p-6 bg-grocery-card border border-border hover:shadow-card-hover transition-all duration-200 hover:scale-[1.02] cursor-pointer group">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {/* You can add an icon here if you want, e.g. <ShoppingCart /> */}
                      <h3 className="font-bold text-lg text-grocery-text truncate">
                        {list.title || "Untitled List"}
                      </h3>
                    </div>
                    <span className="text-sm text-grocery-text-light">
                      {list.createdAt instanceof Date ? list.createdAt.toLocaleDateString() : new Date(list.createdAt).toLocaleDateString()}
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
                </div>
              </Card>
            );
          })}
          {firstFive.length === 0 && (
            <div className="text-gray-500">No lists found.</div>
          )}
        </div>
      </div>
    </>
  );
}
