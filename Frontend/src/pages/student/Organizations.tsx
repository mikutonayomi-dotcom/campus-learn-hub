import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Users, Calendar, Search, Loader2, Briefcase
} from "lucide-react";
import { useMyOrganizations } from "@/hooks/useApi";

const StudentOrganizations = () => {
  const { data: organizations, isLoading } = useMyOrganizations();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrganizations = organizations?.filter((org: any) =>
    org.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const getRoleBadge = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'president':
        return <Badge variant="default" className="bg-purple-500">President</Badge>;
      case 'vice-president':
        return <Badge variant="default" className="bg-blue-500">Vice President</Badge>;
      case 'secretary':
        return <Badge variant="default" className="bg-green-500">Secretary</Badge>;
      case 'treasurer':
        return <Badge variant="default" className="bg-yellow-500">Treasurer</Badge>;
      case 'member':
        return <Badge variant="outline">Member</Badge>;
      default:
        return <Badge variant="outline">{role || 'Member'}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Organizations</h1>
          <p className="text-muted-foreground text-sm">
            View your organization memberships
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search organizations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredOrganizations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrganizations.map((org: any) => (
            <Card key={org.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{org.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {org.description || 'No description'}
                      </p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Your Role:</span>
                      {getRoleBadge(org.pivot?.role)}
                    </div>
                    {org.pivot?.joined_at && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Joined: {new Date(org.pivot.joined_at).toLocaleDateString()}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{org.members_count || 0} members</span>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full" size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No organizations found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'Try a different search term' : 'You are not a member of any organizations yet'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentOrganizations;
