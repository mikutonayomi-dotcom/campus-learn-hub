const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center h-64 text-center animate-fade-in">
    <h2 className="text-xl font-display font-bold text-foreground">{title}</h2>
    <p className="text-sm text-muted-foreground mt-2">This module is under development.</p>
  </div>
);

export default PlaceholderPage;
