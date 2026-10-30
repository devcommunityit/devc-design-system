import { Breadcrumb, BreadcrumbItem } from '@dev-community/ui';

export function Basic() {
  return (
    <Breadcrumb>
      <BreadcrumbItem href="#home">Home</BreadcrumbItem>
      <BreadcrumbItem href="#clienti">Clienti</BreadcrumbItem>
      <BreadcrumbItem>Studio Bianchi S.r.l.</BreadcrumbItem>
    </Breadcrumb>
  );
}

export function Collapsed() {
  return (
    <Breadcrumb maxItems={3}>
      <BreadcrumbItem href="#home">Home</BreadcrumbItem>
      <BreadcrumbItem href="#amministrazione">Amministrazione</BreadcrumbItem>
      <BreadcrumbItem href="#fatture">Fatture</BreadcrumbItem>
      <BreadcrumbItem href="#2025">2025</BreadcrumbItem>
      <BreadcrumbItem>Fattura n. 2025/0142 del 14 febbraio</BreadcrumbItem>
    </Breadcrumb>
  );
}
