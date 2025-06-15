
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Search, Sparkles } from "lucide-react";
import { useGlobalSearch, SearchResult } from "@/hooks/useGlobalSearch";

export const GlobalSearch = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const { data: allItems, isLoading } = useGlobalSearch();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const runCommand = useCallback((command: () => unknown) => {
        setOpen(false);
        command();
    }, []);

    const handleSelect = (url: string) => {
        runCommand(() => navigate(url));
    };

    const groupedResults = allItems?.reduce((acc, item) => {
        const { type } = item;
        if (!acc[type]) {
            acc[type] = [];
        }
        acc[type].push(item);
        return acc;
    }, {} as Record<SearchResult['type'], SearchResult[]>);

    return (
        <>
            <Button
                variant="outline"
                className="relative h-9 w-9 sm:w-full justify-center sm:justify-start rounded-xl bg-background/60 backdrop-blur-md text-sm font-normal text-muted-foreground shadow-lg border-border/30 sm:pr-12 md:w-48 lg:w-72 search-button-premium group overflow-hidden hover:shadow-xl transition-all duration-300"
                onClick={() => setOpen(true)}
            >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                
                <div className="relative flex items-center w-full">
                    <Search className="h-4 w-4 sm:mr-2 text-primary/70 group-hover:text-primary transition-colors duration-200" />
                    <span className="hidden sm:inline-flex flex-1 text-left">Buscar...</span>
                    <Sparkles className="hidden sm:block h-3 w-3 text-primary/50 absolute right-12 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted/80 backdrop-blur-sm px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex border-border/30">
                        <span className="text-xs">⌘</span>K
                    </kbd>
                </div>
            </Button>
            
            <CommandDialog open={open} onOpenChange={setOpen}>
                <div className="command-dialog-premium">
                    {/* Background effects */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
                    <div className="absolute inset-0 bg-dots-pattern opacity-20" />
                    
                    <div className="relative">
                        <CommandInput 
                            placeholder="Busca en toda la aplicación..." 
                            className="border-0 bg-transparent text-base placeholder:text-muted-foreground/70 focus:ring-0 command-input-premium"
                        />
                        <CommandList className="command-list-premium">
                            <CommandEmpty className="py-8 text-center">
                                <div className="flex flex-col items-center gap-2">
                                    <Search className="h-8 w-8 text-muted-foreground/50" />
                                    <p className="text-muted-foreground">No se encontraron resultados.</p>
                                </div>
                            </CommandEmpty>
                            {isLoading && (
                                <div className="p-8 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary/30 border-t-primary" />
                                        <p className="text-sm text-muted-foreground">Buscando...</p>
                                    </div>
                                </div>
                            )}
                            {groupedResults && Object.entries(groupedResults).map(([type, items]) => (
                                <CommandGroup key={type} heading={type} className="command-group-premium">
                                    {items.map((item) => (
                                        <CommandItem
                                            key={item.id}
                                            value={item.title}
                                            onSelect={() => handleSelect(item.url)}
                                            className="command-item-premium group flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 transition-all duration-200 cursor-pointer"
                                        >
                                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-200">
                                                <item.icon className="h-4 w-4 text-primary" />
                                            </div>
                                            <span className="flex-1 font-medium group-hover:text-primary transition-colors duration-200">{item.title}</span>
                                            <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">{type}</span>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            ))}
                        </CommandList>
                    </div>
                </div>
            </CommandDialog>
        </>
    );
};
