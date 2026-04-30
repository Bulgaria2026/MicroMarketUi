import { ErrorDisplay } from "@/components/ErrorDisplay";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/features/auth/context/use-auth";
import "@/features/rewards/pages/coupon.css";
import { couponOfferCatalogKeys, couponOfferCatalogService } from "@/features/rewards/services/coupon-offer-service";
import { ownCouponKeys, ownCouponService } from "@/features/rewards/services/coupon-service";
import { rewardsProfileKeys, rewardsProfileService } from "@/features/rewards/services/profile-service";
import type { CouponResponse } from "@/features/rewards/types/coupon";
import type { CouponOfferResponse } from "@/features/rewards/types/coupon-offer";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Coins, Gift, Ticket } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function formatDiscount(amount: number): string {
  const formatted = amount % 1 === 0 ? `€${amount}` : `€${amount.toFixed(2)}`;
  return `${formatted} OFF`;
}

function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

// ─── Coupon Store ─────────────────────────────────────────────────────────────

function OfferCoupon({
  offer,
  userPoints,
}: Readonly<{
  offer: CouponOfferResponse;
  userPoints: number;
}>) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const canAfford = userPoints >= offer.pointCost;
  const spotsLeft = offer.maxPurchases !== null ? offer.maxPurchases - offer.purchaseCount : null;
  const pointsLabel = offer.pointCost === 0 ? "Free" : `${offer.pointCost.toLocaleString()} pts`;

  const purchaseMutation = useMutation({
    meta: { suppressGlobalError: true },
    mutationFn: () => couponOfferCatalogService.purchase(offer.id),
    onSuccess: () => {
      toast.success("Coupon added to your wallet!");
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: rewardsProfileKeys.own });
      queryClient.invalidateQueries({ queryKey: ownCouponKeys.all });
      queryClient.invalidateQueries({ queryKey: couponOfferCatalogKeys.catalog });
    },
    onError: () => {
      toast.error("Failed to redeem offer. Check your points balance.");
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div
          className={`mm-coupon mm-coupon-clickable ${!canAfford ? " mm-coupon-inactive" : ""}`}
          role="button"
          tabIndex={0}
        >
          <div className="mm-coupon-left">
            <div>{pointsLabel}</div>
          </div>
          <div className="mm-coupon-center">
            <div>
              <h2>{formatDiscount(offer.amountOff)}</h2>
              <h3>{offer.name}</h3>
              <small>{offer.expiryDate ? `Valid until ${formatShortDate(offer.expiryDate)}` : "No expiry"}</small>
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{offer.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {offer.description && <p className="text-sm text-muted-foreground">{offer.description}</p>}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">Discount</span>
              <span className="font-semibold">{formatDiscount(offer.amountOff)}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">Cost</span>
              <span className="font-semibold">{pointsLabel}</span>
            </div>
            {offer.expiryDate && (
              <div className="flex flex-col gap-0.5">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">Valid Until</span>
                <span className="font-semibold">{formatShortDate(offer.expiryDate)}</span>
              </div>
            )}
            {spotsLeft !== null && (
              <div className="flex flex-col gap-0.5">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">Spots Left</span>
                <span className="font-semibold">{spotsLeft}</span>
              </div>
            )}
          </div>
          {!canAfford && (
            <p className="text-sm font-medium text-destructive">
              You need {(offer.pointCost - userPoints).toLocaleString()} more points to redeem this offer.
            </p>
          )}
        </div>
        <DialogFooter>
          <Button disabled={!canAfford || purchaseMutation.isPending} onClick={() => purchaseMutation.mutate()}>
            {purchaseMutation.isPending ? "Purchasing…" : "Confirm Purchase"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CouponStoreTab({ userPoints }: Readonly<{ userPoints: number }>) {
  const {
    data: offers,
    isLoading,
    isError,
  } = useQuery({
    queryKey: couponOfferCatalogKeys.catalog,
    queryFn: couponOfferCatalogService.getCatalog,
  });

  if (isLoading) {
    return (
      <div>
        <p className="text-sm text-muted-foreground pb-5">
          Earn points on every order. Redeem them for discount coupons.
        </p>
        <div className="flex flex-wrap gap-6">
          {Array.from({ length: 4 }, (_, i) => `offer-skel-${i}`).map(key => (
            <Skeleton key={key} className="h-31.25 w-75 max-w-full rounded-[8px]" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) return <ErrorDisplay />;

  if (!offers || offers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <Gift className="size-12 opacity-30 mb-3" />
        <p className="font-medium">No offers available</p>
        <p className="text-sm mt-1">Check back later for new coupon offers.</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-muted-foreground pb-5">
        Earn points on every order. Redeem them for discount coupons.
      </p>
      <div className="flex flex-wrap gap-6">
        {offers.map(offer => (
          <OfferCoupon key={offer.id} offer={offer} userPoints={userPoints} />
        ))}
      </div>
    </div>
  );
}

// ─── My Coupons ───────────────────────────────────────────────────────────────

function MyCouponCard({ coupon }: Readonly<{ coupon: CouponResponse }>) {
  const [copied, setCopied] = useState(false);

  const isExpired = coupon.expiryDate ? new Date(coupon.expiryDate) < new Date() : false;
  const isUsedUp = coupon.maxRedemptions !== null && coupon.timesRedeemed >= coupon.maxRedemptions;
  const isInactive = !coupon.active || isExpired || isUsedUp;

  const getInactiveReason = (): string => {
    if (isExpired) return "Expired";
    if (isUsedUp) return "Used";
    return "Inactive";
  };

  const getExpiryLabel = (): string => {
    return coupon.expiryDate ? `Valid until ${formatShortDate(coupon.expiryDate)}` : "No expiry";
  };

  const validityLabel = isInactive ? getInactiveReason() : getExpiryLabel();

  function handleCopy() {
    navigator.clipboard.writeText(coupon.code).then(() => {
      setCopied(true);
      toast.success("Code copied!");
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <button
      className={`mm-coupon mm-coupon-clickable${isInactive ? " mm-coupon-inactive" : ""}`}
      tabIndex={0}
      onClick={handleCopy}
      onKeyDown={e => e.key === "Enter" && handleCopy()}
      title="Click to copy code"
    >
      <div className="mm-coupon-left">
        <div>{copied ? "Copied!" : coupon.code}</div>
      </div>
      <div className="mm-coupon-center">
        <div>
          <h2>{formatDiscount(coupon.amountOff)}</h2>
          <h3>Coupon</h3>
          <small>{validityLabel}</small>
        </div>
      </div>
    </button>
  );
}

function MyCouponsTab() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ownCouponKeys.list(),
    queryFn: () => ownCouponService.findOwn({ size: 50 }),
  });

  if (isLoading) {
    return (
      <div className="space-y-5">
        <p className="text-sm text-muted-foreground">
          Click a coupon to copy its code, then enter it in the <strong>"Add promotion code"</strong> field during
          Stripe checkout.
        </p>
        <div className="flex flex-wrap gap-5">
          {Array.from({ length: 3 }, (_, i) => `coupon-skel-${i}`).map(key => (
            <Skeleton key={key} className="h-31.25 w-75 max-w-full rounded-[8px]" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) return <ErrorDisplay />;

  const coupons = data?.content ?? [];
  const totalElements = data?.page.totalElements ?? 0;

  if (coupons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <Ticket className="size-12 opacity-30 mb-3" />
        <p className="font-medium">No coupons yet</p>
        <p className="text-sm mt-1">Redeem an offer from the Coupon Store to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">
        Click a coupon to copy its code, then enter it in the <strong>"Add promotion code"</strong> field during Stripe
        checkout.
      </p>
      <div className="flex flex-wrap gap-5">
        {coupons.map(coupon => (
          <MyCouponCard key={coupon.id} coupon={coupon} />
        ))}
      </div>
      {totalElements > coupons.length && (
        <p className="text-xs text-muted-foreground">
          Showing {coupons.length} of {totalElements} coupons.
        </p>
      )}
    </div>
  );
}

// ─── Points Header ────────────────────────────────────────────────────────────

function PointsHeader({ points, isLoading }: Readonly<{ points: number | undefined; isLoading: boolean }>) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-4 py-3">
        <Coins className="size-4 shrink-0" />
        {isLoading ? (
          <Skeleton className="h-5 w-20" />
        ) : (
          <span className="text-sm font-semibold tabular-nums">{(points ?? 0).toLocaleString()} pts</span>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function RewardsPage() {
  const { isAuthenticated } = useAuth();

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: rewardsProfileKeys.own,
    queryFn: rewardsProfileService.getOwn,
    enabled: isAuthenticated,
  });

  return (
    <div className="py-8">
      <div className="flex gap-10">
        <h1 className="text-2xl font-semibold mb-2">My Rewards</h1>
        <PointsHeader points={profile?.points} isLoading={profileLoading} />
      </div>
      <Tabs defaultValue="store">
        <TabsList className="mb-6 -mt-2">
          <TabsTrigger value="store">
            <span className="flex items-center gap-1.5">
              <Gift className="size-3.5" />
              Coupon Store
            </span>
          </TabsTrigger>
          <TabsTrigger value="coupons">
            <span className="flex items-center gap-1.5">
              <Ticket className="size-3.5" />
              My Coupons
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="store">
          <CouponStoreTab userPoints={profile?.points ?? 0} />
        </TabsContent>

        <TabsContent value="coupons">
          <MyCouponsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
