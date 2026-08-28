import { testimonialsExact } from '@/content/testimonials-exact'

// Homepage testimonial columns — three text-only, auto-scrolling tracks.

type Review = (typeof testimonialsExact)[number]

function columnSlice(list: Review[], col: number): Review[] {
  const size = 25
  const start = col * size
  return list.slice(start, start + size)
}

const reviewColumns = [0, 1, 2].map(col => columnSlice(testimonialsExact, col))

export function ReviewColumns() {
  return <div className="nws-reviews-grid" aria-label="Customer testimonials">
    {reviewColumns.map((colReviews, col) => (
      <div className="nws-rev-col" key={col}>
        <div className="nws-rev-scroll">
          <div className={`nws-rev-track${col === 0 ? ' nws-rev-track-down' : col === 1 ? ' nws-rev-track-up' : ' nws-rev-track-down'}`}>
            {/* each column loops its slice twice for a seamless infinite scroll */}
            {[...colReviews, ...colReviews].map((review, i) => (
              <ReviewCard key={`${col}-${i}`} review={review} hidden={i >= colReviews.length} />
            ))}
          </div>
        </div>
      </div>
    ))}
  </div>
}

function ReviewCard({ review, hidden }: { review: Review; hidden: boolean }) {
  const name = review.author.replace(/^—\s*|^–\s*/, '')
  const quote = review.quote.replace(/^[“”"'`\s]+/, '').replace(/[”"'`\s]+$/, '')

  return <article className="nws-review-card" aria-hidden={hidden || undefined}>
    {name && <cite>{name}</cite>}
    <blockquote>{quote}</blockquote>
  </article>
}
