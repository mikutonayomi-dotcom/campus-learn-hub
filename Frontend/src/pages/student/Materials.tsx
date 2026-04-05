import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FolderOpen, FileText, Video, Link, Download, Loader2, ExternalLink } from "lucide-react";
import { useMyMaterials } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";

const typeIcons: Record<string, React.ElementType> = { pdf: FileText, video: Video, link: Link, doc: FileText, image: FileText, other: FileText };

const StudentMaterials = () => {
  const { data: materials, isLoading } = useMyMaterials();
  const { toast } = useToast();

  const handleDownload = (material: any) => {
    if (material.external_link) {
      window.open(material.external_link, '_blank');
    } else if (material.file_path) {
      toast({ title: "Download", description: `Downloading ${material.title}...` });
      // In production, implement actual file download
    } else {
      toast({ title: "Error", description: "No file available for download", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2"><FolderOpen className="h-6 w-6 text-primary" /> Learning Materials</h1>
        <p className="text-muted-foreground text-sm">Access lessons, modules, and uploaded resources</p>
      </div>
      
      {materials?.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No learning materials available yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {materials?.map((m: any) => {
            const Icon = typeIcons[m.type] || FileText;
            const isLink = m.type === 'link' || m.external_link;
            return (
              <Card key={m.id} className="transition-all duration-200 hover:shadow-md hover:translate-x-1 cursor-pointer group">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{m.title}</p>
                    <p className="text-xs text-muted-foreground">{m.subject?.code} • {m.subject?.name} • {new Date(m.created_at).toLocaleDateString()}</p>
                    {m.description && <p className="text-xs text-muted-foreground truncate">{m.description}</p>}
                  </div>
                  <Badge variant="outline" className="text-xs shrink-0 capitalize">{m.type}</Badge>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 shrink-0"
                    onClick={() => handleDownload(m)}
                  >
                    {isLink ? <ExternalLink className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentMaterials;
