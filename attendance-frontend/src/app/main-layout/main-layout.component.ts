import {Component, DestroyRef, OnInit, ViewChild} from '@angular/core';
import {MatDivider} from "@angular/material/divider";
import {MatIcon} from "@angular/material/icon";
import {MatAnchor, MatIconButton} from "@angular/material/button";
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {MatToolbar} from "@angular/material/toolbar";
import {NgIf} from "@angular/common";
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet
} from "@angular/router";
import {filter, map, startWith} from 'rxjs';
import {SessionCacheService} from '../services/session-cache.service';
import {Constants} from '../utilities/constants';
import {LogoComponent} from '../logo/logo.component';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {BaseComponent} from '../base-component';
import {
  MatTree,
  MatTreeFlatDataSource,
  MatTreeFlattener,
  MatTreeNode, MatTreeNodeDef, MatTreeNodePadding, MatTreeNodeToggle
} from '@angular/material/tree';
import {FlatTreeControl} from '@angular/cdk/tree';

interface NavNode {
  name: string;
  route?: string;
  queryParams?: any;
  children?: NavNode[];
}

interface FlatNavNode {
  name: string;
  route?: string;
  queryParams?: any;
  level: number;
  expandable: boolean;
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    MatDivider,
    MatIcon,
    MatIconButton,
    MatSidenav,
    MatSidenavContainer,
    MatSidenavContent,
    MatToolbar,
    NgIf,
    RouterLink,
    RouterOutlet,
    MatAnchor,
    LogoComponent,
    MatTree,
    MatTreeNode,
    MatTreeNodeDef,
    MatTreeNodePadding,
    MatTreeNodeToggle,
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent extends BaseComponent implements OnInit {
  private transformer = (node: NavNode, level: number): FlatNavNode => ({
    name: node.name,
    route: node.route,
    queryParams: node.queryParams,
    level,
    expandable: !!node.children?.length
  });

  treeControl = new FlatTreeControl<FlatNavNode>(
    node => node.level,
    node => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this.transformer,
    node => node.level,
    node => node.expandable,
    node => node.children
  );

  dataSource = new MatTreeFlatDataSource(
    this.treeControl,
    this.treeFlattener
  );

  hasChild = (_: number, node: FlatNavNode) => node.expandable;


  @ViewChild('sidenav') sidenav: any;

  pageTitle = '';

  sectionId: number | null = null;

  constructor(
    public sessionCacheService: SessionCacheService,
    public router: Router,
    public route: ActivatedRoute,
    private destroyRef: DestroyRef) {
    super();
  };

  ngOnInit() {
    if (this.sessionCacheService.isAdmin() || (this.sessionCacheService.isOfficer() && !this.isMobile)) {
      this.router.navigate(['/admin/term'])
    } else if (this.sessionCacheService.isLeadership()) {
      this.router.navigate(['/stations/evaluate'])
    }

    this.sectionId = this.sessionCacheService.get(Constants.STORAGE_KEY_SECTION)?.sectionId ?? null;

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        startWith(null),
        map(() => this.getDeepestRoute(this.route)),
        map(route => route.snapshot.title ?? ''),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(title => {
        this.pageTitle = title;
      });

    const links = [];

    // only designated attendance takers access events
    if (this.sessionCacheService.isSectionLeader()
      || this.sessionCacheService.isAttendanceTaker()
      || this.sessionCacheService.isOfficer()) {
      links.push({
        name: 'Upcoming Events',
        route: '/events',
        queryParams: { type: 'upcoming' }
      });
      links.push({
        name: 'Recent Events',
        route: '/events',
        queryParams: { type: 'recent' }
      })
    }

    if (this.sessionCacheService.isSectionLeader() || this.sessionCacheService.isOfficer()) {
      links.push({
        name: 'Volunteer Event Rosters',
        route: '/events',
        queryParams: { type: 'volunteer' }
      })
    }

    // everyone in leadership + admin can access stations
    const stationsLinks = {
      name: 'Stations',
      children: [
        { name: 'Evaluate', route: '/stations/evaluate' },
        { name: 'Lead', route: '/stations-list', queryParams: {action: 'lead'}}
      ]
    };

    if (this.sessionCacheService.isAdmin()) {
      stationsLinks.children.push({ name: 'Manage Stations', route: '/admin/stations' });
    }


    links.push(stationsLinks);

    // only section leaders and officers need the My Section page (admins can see the info elsewhere)
    if (this.sessionCacheService.isSectionLeader() || this.sessionCacheService.isOfficer()) {
      links.push({
        name: 'My Section',
        route: `/section/${this.sectionId}`
      })
    }

    const adminLinks = [
      { name: 'View Term', route: '/admin/term' },
      { name: 'Users/Roles', route: '/admin/users' },
      { name: 'Attendance', route: '/admin/attendance' },
      { name: 'Stations Progress', route: '/admin/stations-progress' }
    ]

    if (this.sessionCacheService.isOfficer()) {
      adminLinks.push({ name: 'Manage Stations', route: '/admin/stations' });
      links.push({
        name: 'Admin',
        children: adminLinks
      })
    } else if (this.sessionCacheService.isAdmin()) {
      links.push(...adminLinks);
    }

    this.dataSource.data = links;
  }

  private getDeepestRoute(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) {
      route = route.firstChild;
    }

    return route;
  }

  public goToSection() {
    let sectionId = this.sessionCacheService.get(Constants.STORAGE_KEY_SECTION).sectionId;

    this.sidenav?.toggle();
    this.router.navigate(['/section', sectionId]);
  }

  protected readonly STORAGE_KEY_SECTION = Constants.STORAGE_KEY_SECTION;
}
