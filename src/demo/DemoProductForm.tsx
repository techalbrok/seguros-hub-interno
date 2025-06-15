
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Product, ProductCategory } from "@/types";

interface DemoCompany { id: string; name: string; }

interface DemoProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product;
  onSubmit: (data: any) => void;
  categories: ProductCategory[];
  companies: DemoCompany[];
}

const initialFormData = {
    title: "",
    process: "",
    strengths: "",
    observations: "",
    categoryId: "",
    companyId: "",
};

export const DemoProductForm = ({ open, onOpenChange, product, onSubmit, categories, companies }: DemoProductFormProps) => {
    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        if (product) {
            setFormData({
                title: product.title || "",
                process: product.process || "",
                strengths: product.strengths || "",
                observations: product.observations || "",
                categoryId: product.categoryId || "",
                companyId: product.companyId || "",
            });
        } else {
            setFormData(initialFormData);
        }
    }, [product, open]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        const resultValue = value === "none" ? "" : value;
        setFormData(prev => ({ ...prev, [name]: resultValue }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>{product ? 'Editar Producto' : 'Nuevo Producto'}</DialogTitle>
                    <DialogDescription>
                        {product ? 'Edita los detalles del producto.' : 'Añade un nuevo producto al catálogo de demostración.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div>
                        <Label htmlFor="title">Título *</Label>
                        <Input id="title" value={formData.title} onChange={handleChange} required />
                    </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="categoryId">Categoría</Label>
                            <Select value={formData.categoryId || "none"} onValueChange={(value) => handleSelectChange('categoryId', value)}>
                                <SelectTrigger><SelectValue placeholder="Seleccionar categoría" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Sin categoría</SelectItem>
                                    {categories.map((cat) => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="companyId">Compañía</Label>
                             <Select value={formData.companyId || "none"} onValueChange={(value) => handleSelectChange('companyId', value)}>
                                <SelectTrigger><SelectValue placeholder="Seleccionar compañía" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Sin compañía</SelectItem>
                                    {companies.map((comp) => <SelectItem key={comp.id} value={comp.id}>{comp.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="process">Proceso</Label>
                        <Textarea id="process" value={formData.process} onChange={handleChange} placeholder="Describe el proceso de contratación, gestión, etc." />
                    </div>
                     <div>
                        <Label htmlFor="strengths">Fortalezas</Label>
                        <Textarea id="strengths" value={formData.strengths} onChange={handleChange} placeholder="Enumera las fortalezas y puntos clave del producto." />
                    </div>
                     <div>
                        <Label htmlFor="observations">Observaciones</Label>
                        <Textarea id="observations" value={formData.observations} onChange={handleChange} placeholder="Añade cualquier observación o detalle adicional." />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
                        <Button type="submit">Guardar</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
